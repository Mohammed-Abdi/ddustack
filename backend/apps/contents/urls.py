# type: ignore
from rest_framework.routers import DefaultRouter

from .views import ContentViewSet, DownloadLogViewSet

router = DefaultRouter()
router.register(r"contents", ContentViewSet, basename="content")
router.register(r"download-logs", DownloadLogViewSet, basename="downloadlog")

urlpatterns = router.urls
