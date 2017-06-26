from django.core.management.base import BaseCommand

from photod.core.models import MediaFile

import os


class Command(BaseCommand):
    help = 'Clean all media files that do not exist.'

    def handle(self, *args, **options):
        cleanup = []

        # Collect all media files that do not exist anymore.
        for media_file in MediaFile.objects.all():
            if not os.path.isfile(media_file.path):
                cleanup.append(media_file.id)

                self.stdout.write(self.style.WARNING(
                    'Media file "%s" does not exist.' % media_file.path))

        # Perform the cleanup.
        MediaFile.objects.filter(id__in=cleanup).delete()
