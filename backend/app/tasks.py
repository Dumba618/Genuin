from celery import Celery
from .config import settings

celery_app = Celery("genuin", broker=settings.CELERY_BROKER_URL, backend=settings.CELERY_RESULT_BACKEND)

@celery_app.task
def process_media(media_urls):
    # Stub for media processing
    pass