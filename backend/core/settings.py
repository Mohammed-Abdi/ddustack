import os
from datetime import timedelta
from pathlib import Path
from typing import Any

from dotenv import load_dotenv  # type: ignore[import]

# -------------------------------
# Load environment variables
# -------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# -------------------------------
# Security
# -------------------------------
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "unsafe-default-secret")
DEBUG = os.environ.get("DJANGO_DEBUG", "True").lower() == "true"
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI")
GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET")
APPLE_CLIENT_ID = os.environ.get("APPLE_CLIENT_ID")
APPLE_TEAM_ID = os.environ.get("APPLE_TEAM_ID")
APPLE_KEY_ID = os.environ.get("APPLE_KEY_ID")
APPLE_PRIVATE_KEY = os.environ.get("APPLE_PRIVATE_KEY")

# -------------------------------
# Installed Apps
# -------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "apps.users",
    "apps.schools",
    "apps.departments",
    "apps.courses",
    "apps.course_offerings",
    "apps.contents",
    "apps.notifications",
    "apps.saved_courses",
    "apps.intake",
]

# -------------------------------
# Middleware
# -------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# -------------------------------
# URL configuration
# -------------------------------
ROOT_URLCONF = "core.urls"
AUTH_USER_MODEL = "users.User"

# -------------------------------
# Templates
# -------------------------------
TEMPLATES: list[Any] = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

# -------------------------------
# Database (PostgreSQL)
# -------------------------------
DATABASES: dict[str, Any] = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB"),
        "USER": os.environ.get("POSTGRES_USER"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD"),
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}

# -------------------------------
# Password Validators
# -------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -------------------------------
# Internationalization
# -------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# -------------------------------
# Static Files
# -------------------------------
STATIC_URL = "static/"

# -------------------------------
# Default Primary Key Field
# -------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# -------------------------------
# Django REST Framework / JWT
# -------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework_simplejwt.authentication.JWTAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
}

SIMPLE_JWT: dict[str, Any] = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# -------------------------------
# CORS configuration
# -------------------------------
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")
CORS_ALLOW_CREDENTIALS = True

# -------------------------------
# ANSI Color Codes for Logging
# -------------------------------
LOG_COLOR_SUCCESS = "\033[92m"
LOG_COLOR_FAILURE = "\033[91m"
LOG_COLOR_RESET = "\033[0m"
