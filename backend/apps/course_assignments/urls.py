# type: ignore
from rest_framework.routers import DefaultRouter

from .views import CourseAssignmentViewSet

router = DefaultRouter()
router.register(r"course-assignments", CourseAssignmentViewSet, basename="courseassignment")

urlpatterns = router.urls
