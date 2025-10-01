# type: ignore
from rest_framework.routers import DefaultRouter

from .views import ContentViewSet

router = DefaultRouter()
router.register(r"contents", ContentViewSet, basename="content")

urlpatterns = router.urls
