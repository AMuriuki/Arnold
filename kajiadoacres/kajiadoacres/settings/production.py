from .base import *

DEBUG = False

SECRET_KEY = 'cb24ba8fc1564c33b0a2540dfd331199'

try:
    from .local import *
except ImportError:
    pass

MEDIA_URL = "https://%s/" % AWS_S3_CUSTOM_DOMAIN
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

ALLOWED_HOSTS = ['www.kajiadoacres.com', 'kajiadoacres.com', '159.203.180.65', 'localhost']