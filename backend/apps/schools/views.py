# type: ignore
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import School
from .permissions import IsAdminOrReadOnly
from .serializers import SchoolSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
