import uuid

from apps.courses.models import Course
from apps.departments.models import Department
from django.db import models


class CourseOffering(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="course_offerings")
    department_id = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="course_offerings")
    year = models.PositiveIntegerField()
    semester = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["course_id"]),
            models.Index(fields=["department_id"]),
            models.Index(fields=["year", "semester"]),
        ]
