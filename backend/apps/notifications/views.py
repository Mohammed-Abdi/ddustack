# type: ignore
from apps.courses.models import CourseOffering
from apps.users.models import User
from rest_framework import filters, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notification
from .pagination import NotificationPagination
from .permissions import IsAdminOrReadOnly
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "message", "type"]
    pagination_class = NotificationPagination

    def get_queryset(self):
        user = self.request.user
        if user.role == "STUDENT":
            return Notification.objects.filter(user_id=user).order_by("-created_at")
        return Notification.objects.all().order_by("-created_at")

    def create(self, request, *args, **kwargs):
        all_users = request.data.get("all_users", False)
        course_id = request.data.get("course_id", None)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if all_users:
            users = User.objects.filter(is_active=True)
        elif course_id:
            course_offerings = CourseOffering.objects.filter(course_id=course_id)
            users = User.objects.filter(
                department_id__in=course_offerings.values_list("department_id", flat=True),
                year__in=course_offerings.values_list("year", flat=True),
                semester__in=course_offerings.values_list("semester", flat=True),
                is_active=True,
            )
        else:
            user_list = request.data.get("user_id", [])
            users = User.objects.filter(id__in=user_list, is_active=True)

        notifications = [
            Notification(
                user_id=user,
                title=serializer.validated_data["title"],
                message=serializer.validated_data["message"],
                type=serializer.validated_data["type"],
            )
            for user in users
        ]
        Notification.objects.bulk_create(notifications)

        return Response({"message": f"Notification sent to {len(users)} users."}, status=status.HTTP_201_CREATED)
