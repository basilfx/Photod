import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
CONF_DIR = os.path.abspath(os.path.dirname(__file__))
BASE_DIR = os.path.abspath(os.path.join(CONF_DIR, "../"))


# Application definition.
# https://docs.djangoproject.com/en/1.11/topics/settings/

DEBUG = False

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',

    'graphene_django',
    'treebeard',
    'django_extensions',
    'django_filters',
    'haystack',
    'haystackbrowser',
    'celery',

    'photod.core',
    'photod.api',
    'photod.cli',
    'photod.web',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'photod.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'photod.wsgi.application'


# Password validation.
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation'
                '.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation'
                '.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation'
                '.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation'
                '.NumericPasswordValidator',
    },
]


# Database settings.
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.spatialite',
        'NAME': os.path.join(BASE_DIR, 'database.db'),
    }
}


# Internationalization.
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images).
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'


# Frontend application settings.

WEBPACK_BUNDLE_URL = 'bundle.js'
WEBPACK_STYLE_URL = 'style.css'

try:
    from .build import WEBPACK_VERSION
except ImportError:
    WEBPACK_VERSION = 'v1'


# Graphene GraphQL settings.
# http://docs.graphene-python.org/projects/django/en/latest/

GRAPHENE = {
    'SCHEMA': 'photod.api.schema.schema'
}


# Logging setup.
# https://docs.djangoproject.com/en/1.11/topics/logging/

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'ERROR'),
        },
        'photod': {
            'handlers': ['console'],
            'level': os.getenv('PHOTOD_LOG_LEVEL', 'ERROR'),
        }
    },
}


# Authentication settings.
# https://docs.djangoproject.com/en/1.11/ref/contrib/auth/

LOGIN_URL = '/login'
LOGIN_REDIRECT_URL = '/'


# Sendfile configuration.
# https://github.com/johnsensible/django-sendfile

SENDFILE_BACKEND = "sendfile.backends.development"


# Haystack search engine configuration.
# http://django-haystack.readthedocs.io/en/stable/

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.simple_backend.SimpleEngine',
    },
}


# Celery message queue configuration.
# http://docs.celeryproject.org/en/stable/

CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_TASK_ALWAYS_EAGER = True


# Other settings

MAPZEN_API_KEY = None
