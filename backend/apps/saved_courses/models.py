import uuid

from apps.courses.models import Course
from apps.users.models import User
from django.db import models


class SavedCourse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saved_courses")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="saved_by_users")
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "saved_courses"
        verbose_name = "Saved Course"
        verbose_name_plural = "Saved Courses"
        unique_together = ("user", "course")
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["course"]),
        ]

    def __str__(self):
        return f"{self.user} saved {self.course}"

    def __repr__(self):
        return f"<SavedCourse user={self.user.email} course={self.course.id}>"
