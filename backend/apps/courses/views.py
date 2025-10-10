# type: ignore
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Course
from .pagination import CoursePagination
from .permissions import IsAdminOrModeratorOrReadOnly
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by("-created_at")
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModeratorOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["code", "abbreviation", "tags"]
    pagination_class = CoursePagination

    def get_queryset(self):
        queryset = Course.objects.all().order_by("-created_at")
        department_id = self.request.query_params.get("departmentId")
        year = self.request.query_params.get("year")
        semester = self.request.query_params.get("semester")

        if department_id:
            queryset = queryset.filter(course_offerings__department_id=department_id)
        if year:
            queryset = queryset.filter(course_offerings__year=year)
        if semester:
            queryset = queryset.filter(course_offerings__semester=semester)

        return queryset.distinct()
