import uuid

from apps.courses.models import Course
from apps.users.models import User
from django.db import models


class CourseAssignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="course_assignments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="course_assignments")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "course_assignments"
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["course"]),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} -> {self.course.code}"

    def __repr__(self):
        return f"<CourseAssignment {self.user.email} | {self.course.code}>"
