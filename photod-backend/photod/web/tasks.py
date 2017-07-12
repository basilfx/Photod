from photod.celery import app


@app.task
def calculate_sum(a, b):
    return a + b
