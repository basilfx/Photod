from django.db import models

from django_extensions.db.models import TimeStampedModel

JOB_STATES = (
    ("busy", "Busy"),
    ("done", "Done"),
)


class Job(TimeStampedModel, models.Model):
    title = models.CharField(max_length=255)

    state = models.CharField(max_length=32, choices=JOB_STATES, default="busy")

    items = models.IntegerField(null=True)
    progress = models.IntegerField(null=True)

    def __str__(self):
        """
        Instance string representation.
        """
        return "%s (%s/%d)" % (
            self.title, self.items or '-', self.progress or '-')
