from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("v1/", include("apps.users.urls")),
    path("v1/", include("apps.schools.urls")),
    path("v1/", include("apps.departments.urls")),
    path("v1/", include("apps.courses.urls")),
    path("v1/", include("apps.course_offerings.urls")),
    path("v1/", include("apps.contents.urls")),
    path("v1/", include("apps.notifications.urls")),
]
