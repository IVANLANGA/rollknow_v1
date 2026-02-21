from .base import *

# Frontend URL - Update this to your local frontend URL
LTI_FRONTEND_URL = 'http://localhost:5173/'  # Frontend URL for LTI launches

# ============================================================================
# LTI COOKIE SETTINGS - CHOOSE YOUR SCENARIO
# ============================================================================

# SCENARIO 1: Using ngrok (HTTPS) - RECOMMENDED FOR LTI TESTING
# The settings from base.py are already correct. Nothing to override!
# Just use ngrok and the base.py settings will work.

# SCENARIO 2: Pure localhost HTTP testing (TEMPORARY - for debugging only!)
# IMPORTANT: This ONLY works if both Sakai AND Django are on localhost
# Setting SameSite to None (Python None, not string) disables SameSite restrictions
# This allows cookies to work between localhost:8080 (Sakai) and localhost:8000 (Django)
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SAMESITE = None  # Disable SameSite for cross-port localhost testing
CSRF_COOKIE_SAMESITE = None     # Disable SameSite for cross-port localhost testing

# CRITICAL: Disable HTTPOnly for LTI state cookies to work in iframes
# HTTPOnly prevents cookies from being accessible in certain iframe contexts
SESSION_COOKIE_HTTPONLY = False
CSRF_COOKIE_HTTPONLY = False

# CRITICAL: Set cookie domain to None to allow localhost cross-port cookies
# This allows cookies to be shared between localhost:8080 (Sakai) and localhost:8000 (Django)
SESSION_COOKIE_DOMAIN = None
CSRF_COOKIE_DOMAIN = None

# Set cookie age to something reasonable (1 hour)
SESSION_COOKIE_AGE = 3600

# IMPORTANT: For production LTI to work, you MUST use HTTPS (ngrok) with the base.py
# cookie settings (SameSite='None', Secure=True). HTTP localhost will NOT work
# for cross-origin iframe embeds required by LTI!


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS settings for localhost cross-origin testing
CORS_ALLOW_ALL_ORIGINS = True  # Only for localhost testing!
CORS_ALLOW_CREDENTIALS = True

# Add allowed origins for cookies (localhost Sakai, Moodle, and Canvas)
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8080',   # Sakai
    'http://localhost:8000',   # Django
    'http://localhost:8888',   # Moodle
    'http://localhost:7000',   # Canvas (localhost)
    'http://canvas.docker:7000',  # Canvas (docker hostname)
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:8888',
    'http://127.0.0.1:7000',
]

