# type: ignore
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CourseOffering
from .pagination import CourseOfferingPagination
from .permissions import IsAdminOrModeratorOrReadOnly
from .serializers import CourseOfferingSerializer


class CourseOfferingViewSet(viewsets.ModelViewSet):
    queryset = CourseOffering.objects.all().order_by("-created_at")
    serializer_class = CourseOfferingSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModeratorOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["id"]
    pagination_class = CourseOfferingPagination

    def get_queryset(self):
        queryset = CourseOffering.objects.all().order_by("-created_at")
        department_id = self.request.query_params.get("departmentId")
        year = self.request.query_params.get("year")
        semester = self.request.query_params.get("semester")

        if department_id:
            queryset = queryset.filter(department_id=department_id)
        if year:
            queryset = queryset.filter(year=year)
        if semester:
            queryset = queryset.filter(semester=semester)

        return queryset
