from django.core.management.base import BaseCommand

from photod.core.models import MediaFile

import hashlib
import magic
import glob
import os


class Command(BaseCommand):
    help = 'Enroll a directory of media files.'

    def add_arguments(self, parser):
        parser.add_argument('directories', nargs='+', type=str)

    def scan(self, directories):
        """
        Scan the directories, and yield each file found. Directories will be
        converted to absolute paths, and de-duplicated.
        """

        history = []

        for directory in directories:
            absolute_path = os.path.abspath(directory)

            if not os.path.isdir(absolute_path):
                continue

            if absolute_path in history:
                continue

            search_path = os.path.join(absolute_path, "**/*")

            for file_path in glob.iglob(search_path, recursive=True):
                if os.path.isfile(file_path):
                    yield file_path

    def enroll(self, file_path):
        """
        Enroll a file.
        """

        # Ensure the file exists.
        if not os.path.isfile(file_path):
            return False

        # Retrieve mime type.
        mime_type = magic.from_file(file_path, mime=True)

        if not mime_type:
            return False

        # Calculate hash of file.
        hash_instance = hashlib.sha256()

        with open(file_path, "rb") as fp:
            while True:
                data = fp.read(hash_instance.block_size)

                if not data:
                    break

                hash_instance.update(data)

        digest = hash_instance.hexdigest()

        return MediaFile(path=file_path, mime_type=mime_type, digest=digest)

    def get_or_create(self, media_file):
        """
        Try to find an existing media file in the database, or insert one if it
        does not exist.

        If the media file already exist, but the path (or digest) does not
        match, it is updated.
        """

        # Try to find it using all information.
        try:
            return MediaFile.objects.get(
                path=media_file.path,
                digest=media_file.digest,
                mime_type=media_file.mime_type
            )
        except MediaFile.DoesNotExist:
            pass

        # Fall back on path and mime type (e.g. file updated).
        try:
            new_media_file = MediaFile.objects.get(
                path=media_file.path,
                mime_type=media_file.mime_type
            )

            # Update digest.
            new_media_file.digest = media_file.digest

            return new_media_file.save()
        except MediaFile.DoesNotExist:
            pass

        # Last, fall back on mime type and digest (e.g. file moved).
        try:
            new_media_file = MediaFile.objects.get(
                digest=media_file.digest,
                mime_type=media_file.mime_type
            )

            # Update path.
            new_media_file.path = media_file.path

            return new_media_file.save()
        except MediaFile.DoesNotExist:
            pass

        # It did not exist, so create one.
        return media_file.save()

    def handle(self, *args, **options):
        for file_path in self.scan(options['directories']):
            media_file = self.enroll(file_path)

            if not media_file:
                self.stdout.write(self.style.WARNING(
                    'Unable to enroll "%s".' % file_path))
                continue

            self.get_or_create(media_file)

            self.stdout.write(self.style.SUCCESS(
                'Enrolled "%s".' % file_path))
