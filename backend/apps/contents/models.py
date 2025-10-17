import uuid
from typing import Any

from apps.courses.models import Course
from django.db import models
from apps.users.models import User
from utils.normalization import normalize_capitalization


class Content(models.Model):
    class ContentType(models.TextChoices):
        LECTURE = "LECTURE", "Lecture"
        ASSIGNMENT = "ASSIGNMENT", "Assignment"
        LAB = "LAB", "Lab"
        TUTORIAL = "TUTORIAL", "Tutorial"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="contents")
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=ContentType.choices)
    path = models.CharField(max_length=255)
    chapter = models.CharField(max_length=255, blank=True, null=True)
    file = models.JSONField()  # type: ignore
    tags = models.JSONField(default=list, blank=True)  # type: ignore
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_contents'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args: Any, **kwargs: Any) -> None:
        if self.title:
            self.title = normalize_capitalization(self.title)
        if self.chapter:
            self.chapter = normalize_capitalization(self.chapter)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.type})"

    def __repr__(self):
        return f"<Content {self.id} | {self.title} | {self.type}>"

    class Meta:
        db_table = "contents"
        verbose_name = "Content"
        verbose_name_plural = "Contents"
        indexes = [
            models.Index(fields=["course"]),
            models.Index(fields=["type"]),
            models.Index(fields=["tags"]),
        ]

class DownloadLog(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='download_logs'
    )
    content = models.ForeignKey(
        Content,
        on_delete=models.CASCADE,
        related_name='download_logs'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f'{self.user} downloaded {self.content.title} at {self.created_at:%Y-%m-%d %H:%M}'
    
    class Meta:
        db_table = 'download_logs'
        verbose_name = 'Download Log'
        verbose_name_plural = 'Download Logs'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['content']),
            models.Index(fields=['created_at']),
        ]