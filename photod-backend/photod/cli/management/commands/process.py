from django import db
from django.core.management.base import BaseCommand

from photod.core.steps import MediaFilePipeline
from photod.core.models import MediaFile

import multiprocessing


def worker(queue, force):
    db.connections.close_all()

    pipeline = MediaFilePipeline()

    while True:
        media_file_id = queue.get()

        # Check for the poison pill.
        if media_file_id is None:
            return

        # Process the media file.
        try:
            media_file = MediaFile.objects.get(id=media_file_id)
        except MediaFile.DoesNotExist:
            continue

        pipeline.process(media_file, {}, force)


class Command(BaseCommand):
    help = 'Process all media files and apply all steps.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--workers', action='store', dest='workers', type=int,
            default=multiprocessing.cpu_count(), help='Number of workers.')
        parser.add_argument(
            '--force', action='store_true', dest='force', default=False,
            help='Force processing of successfull steps.')

    def handle(self, *args, **options):
        queue = multiprocessing.Queue(maxsize=options["workers"])
        workers = [
            multiprocessing.Process(
                target=worker, args=(queue, options["force"]))
            for i in range(options["workers"])
        ]

        # Start all the workers.
        self.stdout.write(self.style.SUCCESS(
            'Starting %d workers.' % options["workers"]))

        for w in workers:
            w.start()

        # Schedule a job one by one.
        for media_file in MediaFile.objects.all():
            self.stdout.write(self.style.SUCCESS(
                'Processing "%s".' % media_file.path))

            queue.put(media_file.id, block=True)

        # Add poison pills to kill workers.
        for w in workers:
            queue.put(None)

        # Wait for the processes to finish.
        self.stdout.write(self.style.SUCCESS('Waiting for workers to finish.'))

        for w in workers:
            w.join()
