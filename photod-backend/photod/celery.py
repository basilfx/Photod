from celery import Celery

import os

# Set the default settings file.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "photod.settings.local")

# Create a Celery context for the application.
app = Celery("photod")

# Using a string here means the worker don't have to serialize the
# configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys should have
# a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
