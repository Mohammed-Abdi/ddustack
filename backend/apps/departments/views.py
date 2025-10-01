# type: ignore
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Department
from .permissions import IsAdminOrModeratorOrReadOnly
from .serializers import DepartmentSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModeratorOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]

    def get_queryset(self):
        queryset = Department.objects.all()
        school_id = self.request.query_params.get("school_id")
        if school_id:
            queryset = queryset.filter(school_id=school_id)
        return queryset
