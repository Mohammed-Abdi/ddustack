# type: ignore
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, CourseOfferingViewSet, CourseAssignmentViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'course-offerings', CourseOfferingViewSet, basename='courseoffering')
router.register(r'course-assignments', CourseAssignmentViewSet, basename='courseassignment')

urlpatterns = router.urls
