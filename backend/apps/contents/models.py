import uuid

from apps.courses.models import Course
from django.db import models


class Content(models.Model):
    class ContentType(models.TextChoices):
        LECTURE = "LECTURE", "Lecture"
        ASSIGNMENT = "ASSIGNMENT", "Assignment"
        LAB = "LAB", "Lab"
        TUTORIAL = "TUTORIAL", "Tutorial"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="contents")
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=ContentType.choices)
    path = models.CharField(max_length=255)
    chapter = models.CharField(max_length=255, blank=True, null=True)
    file = models.JSONField()  # type: ignore
    tags = models.JSONField(default=list, blank=True)  # type: ignore
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "contents"
        verbose_name = "Content"
        verbose_name_plural = "Contents"
        indexes = [
            models.Index(fields=["course_id"]),
            models.Index(fields=["type"]),
            models.Index(fields=["tags"]),
        ]
