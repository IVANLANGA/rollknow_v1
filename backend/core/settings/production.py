from .base import *
import os

# Production-specific settings

# Security - Make sure DEBUG is False in production
DEBUG = False

# Frontend URL - Update this to your production frontend URL
# Set LTI_FRONTEND_URL in your .env file or environment variables
LTI_FRONTEND_URL = os.environ.get('LTI_FRONTEND_URL', 'https://rollknow.co.za/')

# Add your production domain to ALLOWED_HOSTS
# ALLOWED_HOSTS is already defined in base.py with common domains
# Add any additional production domains here if needed
# ALLOWED_HOSTS += ['your-production-domain.com']

# Database - Override with production database settings
# Example for PostgreSQL:
DATABASE = {
     'default': {
         'engine': 'django.db.backends.postgresql',
         'name': os.environ.get('DB_NAME'),
         'user': os.environ.get('DB_USER'),
         'password': os.environ.get('DB_PASSWORD'),
         'host': os.environ.get('DB_HOST'),
         'port': os.environ.get('DB_PORT'),
     }
 }

# Static files - Configure for production
# STATIC_ROOT = BASE_DIR / 'staticfiles'
# STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'

# Cookie settings for LTI are already correctly configured in base.py:
# - SESSION_COOKIE_SAMESITE = 'None'
# - SESSION_COOKIE_SECURE = True
# - CSRF_COOKIE_SAMESITE = 'None'
# - CSRF_COOKIE_SECURE = True
# These settings are REQUIRED for LTI to work in HTTPS cross-origin iframes

# Additional security settings for production
SECURE_SSL_REDIRECT = True  # Redirect HTTP to HTTPS
SECURE_HSTS_SECONDS = 31536000  # Enforce HTTPS for 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Logging - More conservative logging for production
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
        'apps': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
    },
}