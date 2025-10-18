# type: ignore
from django.db.models import Q
from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Content, DownloadLog
from .pagination import ContentPagination
from .permissions import IsAdminOrModeratorOrReadOnly
from .serializers import ContentSerializer, DownloadLogSerializer


class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all().order_by("-created_at")
    serializer_class = ContentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrModeratorOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "tags"]
    pagination_class = ContentPagination

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    def get_queryset(self):
        queryset = Content.objects.all().order_by("-created_at")
        course_id = self.request.query_params.get("course_id")
        search = self.request.query_params.get("search")

        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(tags__icontains=search))

        return queryset.distinct()


class DownloadLogViewSet(viewsets.ModelViewSet):
    queryset = DownloadLog.objects.all().order_by("-created_at")
    serializer_class = DownloadLogSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ContentPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        content_id = self.request.query_params.get("content_id")
        if content_id:
            queryset = queryset.filter(content_id=content_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
