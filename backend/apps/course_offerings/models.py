import uuid

from apps.courses.models import Course
from apps.departments.models import Department
from django.db import models


class CourseOffering(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="course_offerings")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="course_offerings")
    year = models.PositiveIntegerField()
    semester = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "course_offerings"
        indexes = [
            models.Index(fields=["course"]),
            models.Index(fields=["department"]),
            models.Index(fields=["year", "semester"]),
        ]

    def __str__(self):
        return f"{self.course.name} - {self.department.name} ({self.year} / {self.semester})"

    def __repr__(self):
        return f"<CourseOffering {self.course.code} | {self.department.name} | {self.year}/{self.semester}>"
