# type: ignore
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Intake
from .pagination import IntakePagination
from .permissions import IntakePermission
from .serializers import IntakeSerializer


class IntakeViewSet(viewsets.ModelViewSet):
    queryset = Intake.objects.all()
    serializer_class = IntakeSerializer
    permission_classes = [IsAuthenticated, IntakePermission]
    pagination_class = IntakePagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["type", "status"]
    search_fields = ["full_name", "staff_id", "student_id"]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"], permission_classes=[AllowAny], url_path="check-user")
    def check_user(self, request):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        intake = Intake.objects.filter(user_id=user_id).first()
        if intake:
            return Response({"exist": True, "status": intake.status})
        else:
            return Response({"exist": False, "status": None})

    @action(detail=False, methods=["get"], url_path="content-reported")
    def content_reported(self, request):
        content_id = request.query_params.get("content_id")
        if not content_id:
            return Response({"error": "content_id is required"}, status=400)

        exists = Intake.objects.filter(content_id=content_id, type="COMPLAIN").exists()
        return Response({"reported": exists})
