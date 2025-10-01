import uuid

from apps.users.models import User
from django.db import models


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        INFO = "INFO", "Info"
        ALERT = "ALERT", "Alert"
        REMINDER = "REMINDER", "Reminder"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=NotificationType.choices)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "notifications"
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        indexes = [
            models.Index(fields=["user_id"]),
            models.Index(fields=["is_read"]),
            models.Index(fields=["type"]),
        ]

    def __str__(self):
        return f"{self.title} - {self.user_id}"
