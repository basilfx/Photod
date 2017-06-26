from django.core.management.base import BaseCommand

from photod.core.models import MediaFile
from photod.core.steps import Step


class Command(BaseCommand):
    help = 'Process all media files and apply all steps.'

    def handle(self, *args, **options):
        for media_file in MediaFile.objects.all():
            for step in Step.iter_pipeline():
                if step.process(media_file, {}):
                    media_file.save()
