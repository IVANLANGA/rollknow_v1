from dotenv import load_dotenv
import os

from pathlib import Path

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY')

DEBUG = os.environ.get('DEBUG') == 'True'

ALLOWED_HOSTS = [
    '178.18.245.94',
    'api.rollknow.co.za',
    'rollknow.co.za', ''
    'www.rollknow.co.za', 
    'sakai.rollknow.co.za',
    'localhost',
    '127.0.0.1',
    'zora-preterminal-juliane.ngrok-free.dev', 
]


# Application definition

INSTALLED_APPS = [
    'daphne',  # Must be first for Channels support
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party apps
    'channels',
    'rest_framework',
    'corsheaders',
    'lti_tool',
    # Local apps
    'apps.learning_tools_interoperability',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be before CommonMiddleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'lti_tool.middleware.LtiLaunchMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases


# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

# JWT Authentication
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', SECRET_KEY)

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Vite dev server
    'http://localhost:3000',  # Alternative frontend port
]
CORS_ALLOW_CREDENTIALS = True

# Add CSRF trusted origins
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://canvas.nwu.ac.za',
    'https://sakai.rollknow.co.za',
    'https://rollknow.co.za',
    'https://api.rollknow.co.za',
]

# Django Channels Configuration
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('127.0.0.1', 6379)],
        },
    },
}

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'apps.learning_tools_interoperability.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}

# Media Files
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

# Frontend URL (for LTI redirects)
LTI_FRONTEND_URL = os.environ.get('LTI_FRONTEND_URL', 'http://localhost:5173')

# LTI 1.3 JWT Settings
# Allow 5 minutes of clock skew between LMS and Django server
# This prevents "token not yet valid (iat)" errors when clocks are slightly out of sync
LTI_JWT_LEEWAY = 300  # seconds (5 minutes)

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = 'static/'


# X_FRAME_OPTIONS = 'ALLOWALL'  # Or use EXEMPT_URLS if you want more control
# CSRF_COOKIE_SAMESITE = 'None'
# CSRF_COOKIE_SECURE = True
# SESSION_COOKIE_SAMESITE = 'None'
# SESSION_COOKIE_SECURE = True
# SESSION_COOKIE_HTTPONLY = True
# CSRF_COOKIE_HTTPONLY = True



# Cookie settings for LTI in iframes (CRITICAL)
SESSION_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = True

# Allow iframe embedding
X_FRAME_OPTIONS = 'ALLOWALL'

# Trust ngrok's forwarding headers
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Optional but recommended for development
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

# Cache configuration for LTI state/nonce persistence
# Using database cache to ensure state persists across requests in iframes
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'lti_cache_table',
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        '': {  # Root logger
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}
