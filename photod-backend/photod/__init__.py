# Ensure that Celery is loaded when the application is loaded.
__import__("photod.celery")
