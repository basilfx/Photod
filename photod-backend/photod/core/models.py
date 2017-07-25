from django.db import models
from django.contrib.gis.db import models as gis_models
from django.utils.crypto import get_random_string
from django.conf import settings

from treebeard.mp_tree import MP_Node

from django_extensions.db.models import TimeStampedModel

import os

MEDIA_FILE_STEP_RESULTS = (
    ("success", "Success"),
    ("skipped", "Skipped"),
    ("failed", "Failed"),
)


def generate_token():
    return get_random_string(length=64)


class MediaFile(TimeStampedModel, models.Model):
    class Meta:
        ordering = ["recorded"]

    path = models.CharField(max_length=255, db_index=True)
    mime_type = models.CharField(max_length=255, db_index=True)
    digest = models.CharField(max_length=255, db_index=True)

    version = models.IntegerField(default=1)

    steps = models.ManyToManyField(
        "Step", through="MediaFileStep", related_name="media_files")

    name = models.CharField(max_length=255, null=True)
    directory = models.ForeignKey(
        "Directory", null=True, related_name="media_files")

    tags = models.ManyToManyField("Tag")

    file_size = models.IntegerField(null=True)

    width = models.IntegerField(null=True)
    height = models.IntegerField(null=True)
    aspect_ratio = models.FloatField(null=True)

    duration = models.IntegerField(null=True)

    orientation = models.IntegerField(null=True)
    flip = models.NullBooleanField()

    recorded = models.DateTimeField(null=True)

    def __str__(self):
        """
        Instance string representation.
        """
        return "%s (%s)" % (self.path, self.mime_type)


class Step(models.Model):
    name = models.CharField(max_length=255, unique=True, db_index=True)

    def __str__(self):
        """
        Instance string representation.
        """
        return self.name


class MediaFileStep(models.Model):
    class Meta:
        unique_together = ("step", "media_file")

    step = models.ForeignKey("Step")
    media_file = models.ForeignKey("MediaFile")

    duration = models.FloatField()
    result = models.CharField(max_length=32, choices=MEDIA_FILE_STEP_RESULTS)
    version = models.IntegerField(default=1)

    def __str__(self):
        """
        Instance string representation.
        """
        return "%s on %s (%s, %.2f seconds)" % (
            self.step.name, self.media_file.path, self.result, self.duration)


class Tag(models.Model):
    class Meta:
        ordering = ["label"]

    label = models.CharField(max_length=255, unique=True, db_index=True)

    def __str__(self):
        """
        Instance string representation.
        """
        return self.label


class Face(models.Model):
    media_file = models.ForeignKey("MediaFile", related_name="faces")

    path = models.CharField(max_length=255)

    x1 = models.FloatField()
    y1 = models.FloatField()
    x2 = models.FloatField()
    y2 = models.FloatField()

    person = models.ForeignKey("Person", null=True)

    is_confirmed = models.BooleanField(default=False)
    is_ignored = models.BooleanField(default=False)
    is_manual = models.BooleanField(default=False)


class Text(models.Model):
    media_file = models.ForeignKey("MediaFile", related_name="texts")

    x1 = models.FloatField()
    y1 = models.FloatField()
    x2 = models.FloatField()
    y2 = models.FloatField()

    content = models.CharField(max_length=1024)
    confidence = models.FloatField()


class Person(models.Model):
    class Meta:
        ordering = ["name"]

    name = models.CharField(max_length=255)

    def __str__(self):
        """
        Instance string representation.
        """
        return self.name


class Palette(models.Model):
    class Meta:
        ordering = ["prominence"]

    media_file = models.ForeignKey("MediaFile", related_name="palette")

    color = models.CharField(max_length=64)
    prominence = models.FloatField()

    classified_color = models.CharField(max_length=64)

    def __str__(self):
        """
        Instance string representation.
        """
        return "%s (%s)" % (self.color, self.classified_color)


class Histogram(models.Model):
    media_file = models.ForeignKey("MediaFile", related_name="histograms")

    channel = models.CharField(max_length=32)
    data = models.CharField(max_length=4096)


class Location(models.Model):
    media_file = models.ForeignKey("MediaFile", related_name="locations")

    point = gis_models.PointField()
    geocode = models.CharField(max_length=8192, null=True)


class Stream(models.Model):
    media_file = models.ForeignKey("MediaFile", related_name="streams")

    width = models.IntegerField()
    height = models.IntegerField()
    aspect_ratio = models.FloatField()


class Thumbnail(models.Model):
    media_file = models.ForeignKey("MediaFile", related_name="thumbnails")

    path = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=255)

    width = models.IntegerField()
    height = models.IntegerField()
    quality = models.IntegerField()

    file_size = models.IntegerField(null=True)


class Filmstrip(models.Model):
    media_file = models.ForeignKey("MediaFile", related_name="filmstrips")

    path = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=255)

    frames = models.IntegerField()

    width = models.IntegerField()
    height = models.IntegerField()
    quality = models.IntegerField()

    file_size = models.IntegerField(null=True)


class Album(MP_Node):
    name = models.CharField(max_length=255)

    node_order_by = ['name']

    def __str__(self):
        """
        Instance string representation.
        """
        return self.name


class Directory(MP_Node):
    full_path = models.CharField(max_length=255, unique=True, db_index=True)
    name = models.CharField(max_length=255)

    node_order_by = ['full_path']

    def __str__(self):
        """
        Instance string representation.
        """
        return self.full_path

    @staticmethod
    def collapse(children):
        """
        Collapse child nodes until the next child node has more than one
        children. For example:

        - A
          - B
            - C
              - D
              - E

        Will become:

        - A/../C
          - D
          - E
        """

        first_children = children

        while True:
            if len(children) == 1:
                next_children = children[0].get_children()

                if len(next_children) == 1:
                    children = next_children
                else:
                    break
            else:
                break

        if first_children is not children:
            result = []

            for child in children:
                child.name = os.path.join(
                    first_children[0].name, "...", child.name)

                result.append(child)

            return result

        return children


class View(models.Model):
    class Meta:
        unique_together = ("media_file", "user")

    media_file = models.ForeignKey("MediaFile", related_name="views")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="views")

    count = models.IntegerField(default=0)


class Star(models.Model):
    class Meta:
        unique_together = ("media_file", "user")

    media_file = models.ForeignKey("MediaFile", related_name="stars")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="stars")


class Share(TimeStampedModel, models.Model):
    media_file = models.ForeignKey("MediaFile", related_name="shared")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="shared")

    data = models.CharField(max_length=255, null=True)
    token = models.CharField(
        max_length=255, unique=True, db_index=True, default=generate_token)

    views = models.IntegerField(default=0)

    expires = models.DateTimeField(null=True)
