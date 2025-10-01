import uuid

from django.db import models


class Course(models.Model):

    class Status(models.TextChoices):
        COMPULSORY = "COMPULSORY", "Compulsory"
        SUPPORTIVE = "SUPPORTIVE", "Supportive"
        COMMON = "COMMON", "Common"
        ELECTIVE = "ELECTIVE", "Elective"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices)
    credit_points = models.PositiveIntegerField(null=True, blank=True)
    lecture_hours = models.PositiveIntegerField(null=True, blank=True)
    lab_hours = models.PositiveIntegerField(null=True, blank=True)
    tutorial_hours = models.PositiveIntegerField(null=True, blank=True)
    homework_hours = models.PositiveIntegerField(null=True, blank=True)
    credit_hours = models.PositiveIntegerField(null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)  # type: ignore
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "courses"
        verbose_name = "Course"
        verbose_name_plural = "Courses"
        indexes = [
            models.Index(fields=["code"]),
            models.Index(fields=["tags"]),
        ]
