# type: ignore
from rest_framework.routers import DefaultRouter

from .views import CourseOfferingViewSet

router = DefaultRouter()
router.register(r"course-offerings", CourseOfferingViewSet, basename="courseoffering")

urlpatterns = router.urls
