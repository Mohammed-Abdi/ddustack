# type: ignore
from rest_framework.routers import DefaultRouter

from .views import SavedCourseViewSet

router = DefaultRouter()
router.register(r"saved-courses", SavedCourseViewSet, basename="savedcourse")

urlpatterns = router.urls
