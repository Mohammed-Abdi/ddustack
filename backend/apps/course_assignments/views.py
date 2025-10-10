# type: ignore
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CourseAssignment
from .pagination import CourseAssignmentPagination
from .permissions import IsAdminOrModeratorOrReadOnly
from .serializers import CourseAssignmentSerializer


class CourseAssignmentViewSet(viewsets.ModelViewSet):
    queryset = CourseAssignment.objects.all().order_by("-created_at")
    serializer_class = CourseAssignmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModeratorOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["user__first_name", "user__last_name", "course__code", "course__name"]
    pagination_class = CourseAssignmentPagination

    def get_queryset(self):
        queryset = CourseAssignment.objects.all().order_by("-created_at")
        user_id = self.request.query_params.get("userId")
        course_id = self.request.query_params.get("courseId")

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if course_id:
            queryset = queryset.filter(course_id=course_id)

        return queryset
