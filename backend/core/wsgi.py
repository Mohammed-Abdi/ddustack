import os
import time

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.wsgi import get_wsgi_application
from django.db.utils import OperationalError

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

application = get_wsgi_application()
User = get_user_model()

required_env = [
    "DJANGO_SUPERUSER_USERNAME",
    "DJANGO_SUPERUSER_EMAIL",
    "DJANGO_SUPERUSER_PASSWORD",
    "DJANGO_SUPERUSER_FIRST_NAME",
    "DJANGO_SUPERUSER_LAST_NAME",
]

missing_vars = [var for var in required_env if not os.environ.get(var)]
if missing_vars:
    print(f"{settings.LOG_COLOR_FAILURE}" f"Superuser creation skipped: missing environment variables: {', '.join(missing_vars)}" f"{settings.LOG_COLOR_RESET}")
else:
    for _ in range(5):
        try:
            if User.objects.filter(is_superuser=True).exists():
                print(f"{settings.LOG_COLOR_FAILURE}" "Superuser creation skipped: superuser already exists" f"{settings.LOG_COLOR_RESET}")
            else:
                User.objects.create_superuser(
                    username=os.environ["DJANGO_SUPERUSER_USERNAME"],
                    email=os.environ["DJANGO_SUPERUSER_EMAIL"],
                    password=os.environ["DJANGO_SUPERUSER_PASSWORD"],
                    first_name=os.environ["DJANGO_SUPERUSER_FIRST_NAME"],
                    last_name=os.environ["DJANGO_SUPERUSER_LAST_NAME"],
                )
                print(
                    f"{settings.LOG_COLOR_SUCCESS}" f"Default superuser created: {os.environ['DJANGO_SUPERUSER_USERNAME']} " f"({os.environ['DJANGO_SUPERUSER_EMAIL']})" f"{settings.LOG_COLOR_RESET}"
                )
            break
        except OperationalError:
            print(f"{settings.LOG_COLOR_FAILURE}" "Database not ready, retrying in 3 seconds..." f"{settings.LOG_COLOR_RESET}")
            time.sleep(3)
    else:
        print(f"{settings.LOG_COLOR_FAILURE}" "Superuser creation failed after multiple attempts." f"{settings.LOG_COLOR_RESET}")
