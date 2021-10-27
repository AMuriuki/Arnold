from kajiadoacres.kajiadoacres.settings.dev import SECRET_KEY
from .base import *

DEBUG = False

try:
    from .local import *
except ImportError:
    pass

MEDIA_URL = "https://%s/" % AWS_S3_CUSTOM_DOMAIN
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'