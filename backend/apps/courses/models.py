import uuid
from typing import Any

from django.contrib.postgres.indexes import GinIndex
from django.db import models
from utils.normalization import normalize_capitalization


class Course(models.Model):

    class Status(models.TextChoices):
        COMPULSORY = "COMPULSORY", "Compulsory"
        SUPPORTIVE = "SUPPORTIVE", "Supportive"
        COMMON = "COMMON", "Common"
        ELECTIVE = "ELECTIVE", "Elective"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255)
    abbreviation = models.CharField(max_length=5)
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

    def save(self, *args: Any, **kwargs: Any) -> None:
        if self.name:
            self.name = normalize_capitalization(self.name)
        if self.abbreviation:
            self.abbreviation = self.abbreviation.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.code})"

    def __repr__(self):
        return f"<Course {self.code} | {self.name}>"

    class Meta:
        db_table = "courses"
        verbose_name = "Course"
        verbose_name_plural = "Courses"
        indexes: list[Any] = [
            models.Index(fields=["code"]),
            models.Index(fields=["abbreviation"]),
            GinIndex(fields=["tags"]),
        ]
