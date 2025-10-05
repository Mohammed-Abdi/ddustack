# type: ignore
from rest_framework.routers import DefaultRouter

from .views import IntakeViewSet

router = DefaultRouter()
router.register(r"intakes", IntakeViewSet, basename="intake")

urlpatterns = router.urls
