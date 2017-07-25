from django import db
from django.core.management.base import BaseCommand

from photod.core.steps import MediaFilePipeline
from photod.core.models import MediaFile
from photod.cli.models import Job

import multiprocessing


def worker(queue, force):
    db.connections.close_all()

    # Prepare the pipeline instance.
    pipeline = MediaFilePipeline()

    while True:
        media_file_id = queue.get()

        # Check for the poison pill.
        if media_file_id is None:
            return

        # Retrieve the media file.
        try:
            media_file = MediaFile.objects.get(id=media_file_id)
        except MediaFile.DoesNotExist:
            continue

        # Process the media file.
        pipeline.process(media_file, {}, force)


class DjangoWorkerPool(object):

    def __init__(self, count, target, args=None):
        self.queue = multiprocessing.Queue(maxsize=1)
        args = (self.queue, ) + (args or ())

        self.workers = [
            multiprocessing.Process(target=target, args=args)
            for i in range(count)
        ]

    def close(self, poison_pill=None):
        for worker in self.workers:
            self.queue.put(poison_pill)

        self.queue.close()

    def start(self):
        for worker in self.workers:
            worker.start()

    def join(self):
        for worker in self.workers:
            worker.join()

    def close_and_join(self, poison_pill=None):
        self.close(poison_pill)
        self.join()


class Command(BaseCommand):
    help = 'Process all media files and apply all steps.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force', action='store_true', dest='force', default=False,
            help='Force steps that have been successful.')
        parser.add_argument(
            '--incremental', action='store_true', dest='incremental',
            default=False, help='Incremental update of media files.')
        parser.add_argument(
            '--workers', action='store', dest='workers', type=int,
            default=multiprocessing.cpu_count(), help='Number of workers.')

    def handle(self, *args, **options):
        pool = DjangoWorkerPool(
            count=options["workers"],
            target=worker,
            args=(options["force"], )
        )

        # Start all the workers.
        self.stdout.write(self.style.SUCCESS(
            'Starting %d workers.' % options["workers"]))

        pool.start()

        # Schedule a job one by one.
        if options["incremental"]:
            media_files = MediaFile.objects.filter(directory__isnull=True)
        else:
            media_files = MediaFile.objects.all()

        try:
            job = Job(
                title="Processing media files.",
                items=media_files.count(), progress=0)
            job.save()

            for media_file in media_files:
                self.stdout.write(self.style.SUCCESS(
                    'Processing "%s".' % media_file.path))

                pool.queue.put(media_file.id, block=True)

                # Update job.
                job.progress += 1
                job.save()

            # Wait for the processes to finish.
            self.stdout.write(self.style.SUCCESS(
                'Waiting for workers to finish.'))
            pool.close_and_join()
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING(
                'Interrupt received, killing workers softly.'))
            pool.close_and_join()
        finally:
            # Update job.
            job.state = "done"
            job.save()
