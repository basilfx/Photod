from PIL import Image

from django.db import IntegrityError
from django.conf import settings
from django.contrib.gis.geos import Point

from photod.core import models
from photod.core.dependencies import Node, get_batches
from photod.core.utils.color_classifier import Classifier

from tesserocr import PyTessBaseAPI, RIL

from mapzen.api import MapzenAPI

import face_recognition
import threading

import itertools
import colorific
import exifread
import platform
import datetime
import logging
import hashlib
import tzlocal
import numpy
import pytz
import json
import time
import cv2
import os
import av

# Logger instance
logger = logging.getLogger(__name__)


def get_cache_path(media_file, basename):
    """
    Helper to generate path to cache file.

    To prevent too many directories in the cache directory, the first three
    digest of the media file ID is taken.
    """

    hash_instance = hashlib.sha256()
    hash_instance.update(str(media_file.id).encode("ascii"))
    digest = hash_instance.hexdigest()

    return os.path.join("cache", digest[:3], str(media_file.id), basename)


class StepMeta(type):
    def __new__(cls, clsname, superclasses, attributedict):
        """
        Meta class for steps.
        """

        clazz = type.__new__(cls, clsname, superclasses, attributedict)

        if hasattr(clazz, "Meta"):
            meta = clazz.Meta

            if not getattr(meta, "disabled", False):
                dependencies = getattr(meta, "depends", ()) + \
                    getattr(meta, "after", ())
                clazz.steps.append(
                    Node(clazz(), meta.name, dependencies))

        return clazz


class Step(object, metaclass=StepMeta):
    """
    Abstract step class.
    """

    steps = []

    @classmethod
    def iter_pipeline(cls):
        """
        Return a pipeline of steps.
        """

        batches = get_batches(cls.steps)

        for batch in batches:
            for node in batch:
                yield node.instance

    def __str__(self):
        return self.Meta.name

    def process(self, media_file, context):
        """
        Process the media file.
        """

        result = "skipped"

        logger.info(
            "Processing media file '%s' with step %s.", media_file, self)

        if not self.is_accepted(media_file):
            logger.debug(
                "Media file '%s' not accepted by %s.", media_file, self)
            return

        if not self.is_fulfilled(media_file):
            logger.debug(
                "Media file '%s' has not fulfilled all dependencies for %s.",
                media_file, self)
            return

        if self.is_taken(media_file):
            logger.debug(
                "Media file '%s' is already processed by %s", media_file, self)
            return

        start = time.time()
        try:
            self.take(media_file, context)
            result = "success"
        except KeyboardInterrupt:
            raise
        except Exception as e:
            logger.exception(
                "Error while processing step '%s' on media file '%s'.",
                self.Meta.name, media_file)
            result = "failed"
        end = time.time()

        step, _ = models.Step.objects.get_or_create(name=self.Meta.name)

        media_file_step, created = models.MediaFileStep.objects.get_or_create(
            media_file=media_file, step=step,
            defaults={"duration": (end - start), "result": result})

        if not created:
            media_file_step.duration = (end - start)
            media_file_step.result = result
            media_file_step.save()

        return media_file

    def is_accepted(self, media_file):
        """
        Return True if the given media file mime type is accepted by this step.
        """

        source = media_file.mime_type.split(";", 1)[0].split("/")

        for mime_type in self.Meta.accepts:
            target = mime_type.split(";", 1)[0].split("/")

            if target[0] == source[0] or target[0] == "*":
                if target[1] == source[1] or target[1] == "*":
                    return True

        return False

    def is_fulfilled(self, media_file):
        """
        Return True if the media file has fulfilled all dependencies to take
        the step.
        """

        for dependency in getattr(self.Meta, 'depends', []):
            steps = [step.name for step in media_file.steps.all()]

            if dependency not in steps:
                return False

        return True

    def is_taken(self, media_file):
        """
        Return True if the media file has already taken this step.
        """

        return self.Meta.name in [step.name for step in media_file.steps.all()]

    def take(self, media_file, context):
        """
        Take the step.
        """

        raise NotImplementedError

    def cleanup(self, media_file, context):
        """
        Perform optional cleanup after processing.
        """

        pass


class ResourceStep(Step):
    """
    Generic step to include lazy loading of resources that may be shared by
    multiple steps.

    This step is always taken, to ensure the resources are available.
    """

    class Meta:
        name = "resource_step_v1"
        accepts = ("*/*", )

    def is_taken(self, media_file):
        return False

    def take(self, media_file, context):
        # Exif data.
        def _exif():
            if "_exif" not in context:
                with open(media_file.path, "rb") as fp:
                    context["_exif"] = exifread.process_file(fp)
            return context["_exif"]
        context["exif"] = _exif

        # Stat data.
        def _stat():
            if "_stat" not in context:
                context["_stat"] = os.stat(media_file.path)
            return context["_stat"]
        context["stat"] = _stat

        # Pillow image.
        def _image():
            if "_image" not in context:
                context["_image"] = Image.open(media_file.path)
            return context["_image"]
        context["image"] = _image

        # PyAV container.
        def _container():
            if "_container" not in context:
                context["_container"] = av.open(media_file.path, "rb")
            return context["_container"]
        context["container"] = _container

    def cleanup(self, media_file, context):
        if "_image" in context:
            context["_image"].close()


class PathStep(Step):
    """
    Path info step.

    This step is always taken, to ensure the path is up to date.
    """

    class Meta:
        name = "path_step_v1"
        accepts = ("*/*", )

    def is_taken(self, media_file):
        return False

    def take(self, media_file, context):
        path = os.path.dirname(media_file.path)

        def _create_directory(path):
            paths = []

            while path:
                paths.append(path)
                new_path, _ = os.path.split(path)

                if new_path == path:
                    break

                path = new_path

            # In reverse order, ensure all directories exist.
            directory = None

            for path in reversed(paths):
                if not directory:
                    try:
                        directory = models.Directory.objects.get(
                            full_path=path)
                    except models.Directory.DoesNotExist:
                        directory = models.Directory.add_root(
                            full_path=path, name=os.path.basename(path))
                else:
                    try:
                        directory = directory.add_child(
                            full_path=path, name=os.path.basename(path))
                    except IntegrityError:
                        directory = models.Directory.objects.get(
                            full_path=path)

            return directory

        # Check if path is up to date, otherwise update it.
        if not media_file.directory or media_file.directory.full_path != path:
            media_file.directory = _create_directory(path)


class FileInfoStep(Step):
    """
    File info step.
    """

    class Meta:
        name = "file_info_v1"
        accepts = ("*/*", )
        depends = ("resource_step_v1", )

    def take(self, media_file, context):
        stat = context["stat"]()

        if not stat:
            return

        media_file.file_size = stat.st_size


class ImageInfoStep(Step):
    """
    Read basic image information step.
    """

    class Meta:
        name = "image_info_v1"
        accepts = ("image/*", )
        depends = ("resource_step_v1", )

    def take(self, media_file, context):
        image = context["image"]()

        if not image:
            return

        media_file.width = image.width
        media_file.height = image.height
        media_file.aspect_ratio = image.width / image.height


class VideoInfoStep(Step):
    """
    Read basic video information step.
    """

    class Meta:
        name = "video_info_v1"
        accepts = ("video/*", )
        depends = ("resource_step_v1", )

    def take(self, media_file, context):
        container = context["container"]()

        if not container:
            return

        media_file.duration = container.duration

        media_file.streams.add(
            *(models.Stream(
                width=stream.width,
                height=stream.height,
                aspect_ratio=stream.width / stream.height
            ) for stream in container.streams.video),
            bulk=False
        )


class VideoStripStep(Step):
    """
    Generate video strip step.

    The video strip is 10 frames.
    """

    class Meta:
        name = "strip_v1"
        accepts = ("video/*", )
        depends = ("video_info_v1", "resource_step_v1")

    def take(self, media_file, context):
        container = context["container"]()

        if not container:
            return

        image = None
        frames = 10

        for index, frame in enumerate(self.iter_frames(container, frames)):
            if image is None:
                image = Image.new("RGB", (frame.width * frames, frame.height))

            image.paste(frame.to_image(), (frame.width * index, 0))

        if not image:
            return

        # Create thumbnails
        sizes = [
            (256 * frames, 256),
            (512 * frames, 512),
        ]

        formats = [
            ("webp", "RGBA", "image/webp"),
            ("jpg", "RGB", "image/jpeg")
        ]

        qualities = [
            100,
            60
        ]

        filmstrips = []

        for size in sizes:
            thumbnail_image = image.copy()
            thumbnail_image.thumbnail(size)

            for extension, mode, mime_type in formats:
                if thumbnail_image.mode != mode:
                    thumbnail_image = thumbnail_image.convert(mode)

                for quality in qualities:
                    relative_path = get_cache_path(
                        media_file, "filmstrip_%dx%d@%d.%s" % (
                            size[0], size[1], quality, extension))
                    absolute_path = os.path.join(
                        settings.MEDIA_ROOT, relative_path)

                    if not os.path.isdir(os.path.dirname(absolute_path)):
                        os.makedirs(os.path.dirname(absolute_path))

                    thumbnail_image = image.copy()
                    thumbnail_image.thumbnail(size)
                    thumbnail_image.save(absolute_path, quality=100)

                    filmstrips.append(
                        models.Filmstrip(
                            frames=frames,
                            width=thumbnail_image.width,
                            height=thumbnail_image.height,
                            quality=quality,
                            mime_type=mime_type,
                            path=relative_path,
                            file_size=os.stat(absolute_path).st_size
                        )
                    )

        media_file.filmstrips.add(*filmstrips, bulk=False)

    def iter_frames(self, video, frames):
        count = 0

        streams = [s for s in video.streams.video]
        streams = [streams[0]]

        for timestamp in range(0, video.duration, video.duration // frames):
            video.seek(timestamp)

            for packet in video.demux(streams):
                frame = packet.decode_one()

                if frame:
                    yield frame

                break


class ThumbnailStep(Step):
    """
    Generate image thumbnail step.
    """

    class Meta:
        name = "thumbnailer_v1"
        accepts = ("image/*", )
        depends = ("image_info_v1", "resource_step_v1")

    def take(self, media_file, context):
        image = context["image"]()

        if not image:
            return

        sizes = [
            (256, 256),
            (512, 512),
            (1024, 1024),
            (2048, 2048)
        ]

        formats = [
            ("webp", "RGBA", "image/webp"),
            ("jpg", "RGB", "image/jpeg")
        ]

        qualities = [
            100,
            60
        ]

        thumbnails = []

        for size in sizes:
            thumbnail_image = image.copy()
            thumbnail_image.thumbnail(size)

            for extension, mode, mime_type in formats:
                if thumbnail_image.mode != mode:
                    thumbnail_image = thumbnail_image.convert(mode)

                for quality in qualities:
                    relative_path = get_cache_path(
                        media_file, "thumbnail_%dx%d@%d.%s" % (
                            size[0], size[1], quality, extension))
                    absolute_path = os.path.join(
                        settings.MEDIA_ROOT, relative_path)

                    if not os.path.isdir(os.path.dirname(absolute_path)):
                        os.makedirs(os.path.dirname(absolute_path))

                    thumbnail_image.save(absolute_path, quality=quality)

                    thumbnails.append(
                        models.Thumbnail(
                            width=thumbnail_image.width,
                            height=thumbnail_image.height,
                            mime_type=mime_type,
                            quality=quality,
                            path=relative_path,
                            file_size=os.stat(absolute_path).st_size
                        )
                    )

        media_file.thumbnails.add(*thumbnails, bulk=False)


class FaceDetectionStep(Step):
    """
    Detect faces step.
    """

    class Meta:
        name = "face_detection_v1"
        accepts = ("image/*", )
        depends = ("image_info_v1", "resource_step_v1")

    def take(self, media_file, context):
        image = context["image"]()

        if not image:
            return

        if (image.width * image.height) > (6000 * 6000):
            return

        if image.mode not in ('RGB', ):
            image = image.convert('RGB')

        faces = face_recognition.face_locations(numpy.array(image))

        media_file.faces.add(
            *(models.Face(
                x1=float(left / media_file.width),
                y1=float(top / media_file.height),
                x2=float(right / media_file.width),
                y2=float(bottom / media_file.height),
            ) for (top, right, bottom, left) in faces),
            bulk=False
        )


class OcrStep(Step):
    """
    Text recognition step.
    """

    class Meta:
        name = "ocr_v1"
        accepts = ("image/*", )
        depends = ("image_info_v1", "resource_step_v1")

    def take(self, media_file, context):
        image = context["image"]()

        if not image:
            return

        if (image.width * image.height) > (6000 * 6000):
            return

        texts = []

        with PyTessBaseAPI() as api:
            api.SetImage(image)

            boxes = api.GetComponentImages(RIL.TEXTLINE, True)

            for _, box, _, _ in boxes:
                api.SetRectangle(box['x'], box['y'], box['w'], box['h'])

                content = api.GetUTF8Text()
                confidence = api.MeanTextConf()

                # Filter empty results.
                if confidence == 0:
                    continue

                if not content.strip():
                    continue

                texts.append(models.Text(
                    x1=float(box['x'] / media_file.width),
                    y1=float(box['y'] / media_file.height),
                    x2=float((box['x'] + box['w']) / media_file.width),
                    y2=float((box['y'] + box['h']) / media_file.height),
                    content=api.GetUTF8Text(),
                    confidence=api.MeanTextConf()
                ))

        media_file.texts.add(*texts, bulk=False)


class ColorPaletteStep(Step):
    """
    Dominant color palette step.
    """

    class Meta:
        name = "color_palette_v1"
        accepts = ("image/*", )

    def take(self, media_file, context):
        result = []

        palette = colorific.extract_colors(media_file.path, max_colors=5)

        media_file.palette.add(
            *(models.Palette(
                color="#%02x%02x%02x" % color.value,
                prominence=color.prominence,
                classified_color=Classifier(rgb=color.value).get_name()
            ) for color in palette.colors),
            bulk=False
        )


class ImageLocationStep(Step):
    """
    Image localization step.
    """

    class Meta:
        name = "location_v1"
        accepts = ("image/jpeg", "image/tiff")
        depends = ("resource_step_v1", )

    def take(self, media_file, context):
        exif = context["exif"]()

        if not exif:
            return

        lat, lon = self.get_exif_location(exif)

        if lat and lon:
            media_file.locations.add(
                models.Location(
                    point=Point(lon, lat)
                ), bulk=False
            )

    def get_exif_location(self, exif_data):
        """
        Returns the latitude and longitude, if available, from the provided
        `exif_data` (obtained through get_exif_data above).
        """

        def _to_degress(value):
            d = float(value.values[0].num) / float(value.values[0].den)
            m = float(value.values[1].num) / float(value.values[1].den)
            s = float(value.values[2].num) / float(value.values[2].den)

            return d + (m / 60.0) + (s / 3600.0)

        lat = None
        lon = None

        gps_latitude = exif_data.get('GPS GPSLatitude')
        gps_latitude_ref = exif_data.get('GPS GPSLatitudeRef')
        gps_longitude = exif_data.get('GPS GPSLongitude')
        gps_longitude_ref = exif_data.get('GPS GPSLongitudeRef')

        if gps_latitude and gps_latitude_ref and \
                gps_longitude and gps_longitude_ref:
            lat = _to_degress(gps_latitude)
            if gps_latitude_ref.values[0] != 'N':
                lat = 0 - lat

            lon = _to_degress(gps_longitude)
            if gps_longitude_ref.values[0] != 'E':
                lon = 0 - lon

        return lat, lon


class GeocodeStep(Step):
    """
    Add geocode information.
    """

    class Meta:
        name = "geocode_v1"
        accepts = ("*/*", )
        after = ("location_v1", )

    def __init__(self):
        self.api = MapzenAPI(settings.MAPZEN_API_KEY)

    def take(self, media_file, context):
        locations = media_file.locations.all()

        if not locations:
            return

        for location in locations:
            lat = location.point.y
            lon = location.point.x

            try:
                response = self.api.reverse(lat, lon)
            except:
                continue

            features = [
                feature for feature in response["features"]
                if feature["type"] == "Feature"
            ]
            features.sort(key=lambda x: -1 * x["properties"]["confidence"])

            try:
                feature = features[0]
            except IndexError:
                continue

            location.geocode = json.dumps(feature)
            location.save()


class HistogramStep(Step):
    """
    Generate a histogram step.

    A histogram is generated for each individual channel.
    """

    class Meta:
        name = "histogram_v1"
        accepts = ("image/*", )
        depends = ("resource_step_v1", )

    def take(self, media_file, context):
        image = context["image"]()

        histograms = []
        histogram = image.histogram()

        for index, channel in enumerate(image.mode):
            histograms.append(
                models.Histogram(
                    channel=channel,
                    data=json.dumps(histogram[index * 256:(index + 1) * 256])
                )
            )

        media_file.histograms.add(*histograms, bulk=False)


class ImageRotationStep(Step):
    """
    Image rotation step.
    """

    class Meta:
        name = "image_rotation_v1"
        accepts = ("image/jpeg", "image/tiff")
        depends = ("resource_step_v1", )

    def take(self, media_file, context):
        exif = context["exif"]()

        if not exif:
            return

        if "Image Orientation" in exif:
            value = exif["Image Orientation"].values[0]

            if value == 1:
                media_file.orientation = 0
                media_file.flip = False
            elif value == 2:
                media_file.orientation = 0
                media_file.flip = True
            elif value == 3:
                media_file.orientation = 180
                media_file.flip = False
            elif value == 4:
                media_file.orientation = 180
                media_file.flip = True
            elif value == 5:
                media_file.orientation = 90
                media_file.flip = True
            elif value == 6:
                media_file.orientation = 90
                media_file.flip = False
            elif value == 7:
                media_file.orientation = 270
                media_file.flip = True
            elif value == 8:
                media_file.orientation = 270
                media_file.flip = False
            else:
                logger.warn("Unknown orientation value: %s", value)


class RecordDateStep(Step):
    """
    Date of recording step.
    """

    class Meta:
        name = "record_date_v1"
        accepts = ("image/jpeg", "image/tiff")
        depends = ("resource_step_v1", )

    def take(self, media_file, context):
        exif = context["exif"]()

        if not exif:
            return

        try:
            if "EXIF DateTimeOriginal" in exif:
                media_file.recorded = datetime.datetime.strptime(str(
                    exif['EXIF DateTimeOriginal']), '%Y:%m:%d %H:%M:%S')
            elif "EXIF DateTimeDigitized" in exif:
                media_file.recorded = datetime.datetime.strptime(str(
                    exif['EXIF DateTimeDigitized']), '%Y:%m:%d %H:%M:%S')

            if media_file.recorded and not media_file.recorded.tzinfo:
                media_file.recorded = media_file.recorded.replace(
                    tzinfo=tzlocal.get_localzone())
        except ValueError:
            pass


class CreationDateStep(Step):
    """
    Date of creation, if record date was not set.
    """

    class Meta:
        name = "creation_date_v1"
        accepts = ("*/*", )
        depends = ("record_date_v1", "resource_step_v1")

    def take(self, media_file, context):
        if media_file.recorded:
            return

        # Get the file creation time, using the best method available.
        if platform.system() == "Windows":
            timestamp = os.path.getctime(path)
        else:
            stat = context["stat"]()

            try:
                timestamp = stat.st_birthtime
            except AttributeError:
                timestamp = stat.st_mtime

        media_file.recorded = datetime.datetime.fromtimestamp(
            timestamp, tz=pytz.UTC)


class AutoTag(Step):
    """
    Autotag step.
    """

    class Meta:
        name = "auto_tag_v1"
        accepts = ("*/*", )
        after = (
            "face_detection_v1",
            "location_v1",
            "file_info_v1",
            "creation_date_v1",
        )

    def take(self, media_file, context):
        def _add_tag(label):
            tag, _ = models.Tag.objects.get_or_create(label=label)

            if tag not in [tag.label for tag in media_file.tags.all()]:
                media_file.tags.add(tag)

        # Add tag for file type.
        if media_file.mime_type.startswith("image/"):
            _add_tag("image")

        if media_file.mime_type.startswith("video/"):
            _add_tag("video")

        # Add tag if it has faces.
        faces_count = media_file.faces.all().count()

        if faces_count > 0:
            _add_tag("faces")

        # Add tag if it has a geo tag.
        locations_count = media_file.locations.all().count()

        if locations_count > 0:
            _add_tag("localized")

        # Classify as panorama when an image (or vidoe) is very wide or
        # extra tall.
        if media_file.aspect_ratio and (
                media_file.aspect_ratio < 0.25 or media_file.aspect_ratio > 2):
            _add_tag("panorama")

        # Add a year tag.
        if media_file.recorded:
            _add_tag(str(media_file.recorded.year))
