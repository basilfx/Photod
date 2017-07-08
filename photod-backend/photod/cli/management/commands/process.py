from django.core.management.base import BaseCommand

from photod.core.models import MediaFile
from photod.core.steps import Step


class Command(BaseCommand):
    help = 'Process all media files and apply all steps.'

    def handle(self, *args, **options):
        for media_file in MediaFile.objects.all():
            self.stdout.write(self.style.SUCCESS(
                'Processing "%s".' % media_file.path))

            try:
                for step in Step.iter_pipeline():
                    step.process(media_file, {})

                # Save changes.
                media_file.save()
            except:
                self.stdout.write(self.style.ERROR(
                    'Errors during processing of "%s".' % media_file.path))
