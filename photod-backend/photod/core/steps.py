from PIL import Image

from django.db import IntegrityError

from photod.core import models
from photod.core.dependencies import Node, get_batches
from photod.core.utils.color_classifier import Classifier

from tesserocr import PyTessBaseAPI, RIL

import face_recognition
import threading

import itertools
import colorific
import exifread
import logging
import time
import os
import av

# Logger instance
logger = logging.getLogger(__name__)


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
        self.take(media_file, context)
        end = time.time()

        step, _ = models.Step.objects.get_or_create(name=self.Meta.name)

        media_file_step, created = models.MediaFileStep.objects.get_or_create(
            media_file=media_file, step=step,
            defaults={"duration": (end - start)})

        if not created:
            media_file_step.duration = (end - start)
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
            if dependency not in [step.name for step in media_file.steps.all()]:
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
                path, _ = os.path.split(path)

            # In reverse order, ensure all directories exist.
            directory = None

            for path in reversed(paths):
                if not directory:
                    try:
                        directory = models.Directory.objects.get(full_path=path)
                    except models.Directory.DoesNotExist:
                        directory = models.Directory.add_root(
                            full_path=path, name=os.path.basename(path))
                else:
                    try:
                        directory = directory.add_child(
                            full_path=path, name=os.path.basename(path))
                    except IntegrityError:
                        directory = models.Directory.objects.get(full_path=path)

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

    def take(self, media_file, context):
        stat = os.stat(media_file.path)

        media_file.file_size = stat.st_size


class ExifStep(Step):
    """
    Read EXIF data step.
    """

    class Meta:
        name = "exif_v1"
        accepts = ("image/jpeg", )

    def take(self, media_file, context):
        with open(media_file.path, "rb") as fp:
            tags = exifread.process_file(fp)

            if tags:
                media_file.exif = {
                    tag: str(tags[tag]) for tag in tags.keys()
                }


class ImageInfoStep(Step):

    class Meta:
        name = "image_info_v1"
        accepts = ("image/*", )
        disabled = False

    def take(self, media_file, context):
        with Image.open(media_file.path) as image:
            media_file.width = image.width
            media_file.height = image.height
            media_file.aspect_ratio = image.width / image.height


class VideoInfoStep(Step):

    class Meta:
        name = "video_info_v1"
        accepts = ("video/*", )

    def take(self, media_file, context):
        result = {
            "streams": []
        }

        container = av.open(media_file.path, "rb")

        if not container:
            return

        media_file.streams.add(
            *(models.Stream(
                width=stream.width,
                height=stream.height,
                aspect_ratio=stream.width / stream.height
            ) for stream in container.streams.video),
            bulk=False
        )


class VideoStripStep(Step):

    class Meta:
        name = "strip_v1"
        accepts = ("video/*", )
        depends = ("video_info_v1", )

    def take(self, media_file, context):
        container = av.open(media_file.path, "rb")

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

        path = os.path.join("cache", "%s_filmstrip.jpg" % media_file.id)
        image.save(path, quality=100)

        # Create thumbnails
        sizes = [(128 * frames, 128), (256 * frames, 256), (512 * frames, 512)]

        filmstrips = []

        for size in sizes:
            path = os.path.join("cache", "%s_filmstrip_%dx%d.jpg" % (
                media_file.id, size[0], size[1]))

            thumbnail_image = image.copy()
            thumbnail_image.thumbnail(size)
            thumbnail_image.save(path, quality=100)

            filmstrips.append(
                models.Filmstrip(
                    frames=frames,
                    width=thumbnail_image.width,
                    height=thumbnail_image.height,
                    quality=100,
                    path=path
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

    class Meta:
        name = "thumbnailer_v1"
        accepts = ("image/*", )
        depends = ("image_info_v1", )

    def take(self, media_file, context):
        sizes = [(128, 128), (256, 256), (512, 512)]

        image = Image.open(media_file.path)

        thumbnails = []

        for size in sizes:
            path = os.path.join("cache", "%s_thumbnail_%dx%d.jpg" % (
                media_file.id, size[0], size[1]))

            thumbnail_image = image.copy()
            thumbnail_image.thumbnail(size)
            thumbnail_image.save(path, quality=100)

            thumbnails.append(
                models.Thumbnail(
                    width=thumbnail_image.width,
                    height=thumbnail_image.height,
                    quality=100,
                    path=path
                )
            )

        media_file.thumbnails.add(*thumbnails, bulk=False)


class FaceDetectionStep(Step):

    class Meta:
        name = "face_detection_v1"
        accepts = ("image/*", )
        depends = ("image_info_v1", )

    def take(self, media_file, context):
        result = []

        image = face_recognition.load_image_file(media_file.path)
        faces = face_recognition.face_locations(image)

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

    class Meta:
        name = "ocr_v1"
        accepts = ("image/*", )
        depends = ("image_info_v1", )

    def take(self, media_file, context):
        texts = []

        with PyTessBaseAPI() as api:
            api.SetImageFile(media_file.path)

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


class AutoTag(Step):

    class Meta:
        name = "auto_tag_v1"
        accepts = ("*/*", )
        after = ("face_detection_v1", )

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
            _add_tag("faces:%d" % faces_count)
