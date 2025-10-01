# type: ignore
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import SavedCourse
from .pagination import SavedCoursePagination
from .serializers import SavedCourseSerializer


class SavedCourseViewSet(viewsets.ModelViewSet):
    serializer_class = SavedCourseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SavedCoursePagination

    def get_queryset(self):
        return SavedCourse.objects.filter(user_id=self.request.user).order_by("-saved_at")

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user)
