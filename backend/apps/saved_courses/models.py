import uuid

from apps.courses.models import Course
from apps.users.models import User
from django.db import models


class SavedCourse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saved_courses")
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="saved_by_users")
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user_id", "course_id")
        indexes = [
            models.Index(fields=["user_id"]),
            models.Index(fields=["course_id"]),
        ]

    def __str__(self):
        return f"{self.user_id} saved {self.course_id}"
