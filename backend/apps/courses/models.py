import uuid
from typing import Any

from django.contrib.postgres.indexes import GinIndex
from django.db import models
from utils.normalization import normalize_capitalization
from apps.departments.models import Department
from apps.users.models import User


class Course(models.Model):
    class Status(models.TextChoices):
        COMPULSORY = 'COMPULSORY', 'Compulsory'
        SUPPORTIVE = 'SUPPORTIVE', 'Supportive'
        COMMON = 'COMMON', 'Common'
        ELECTIVE = 'ELECTIVE', 'Elective'

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
        return f'{self.name} ({self.code})'

    def __repr__(self):
        return f'<Course {self.code} | {self.name}>'

    class Meta:
        db_table = 'courses'
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        indexes: list[Any] = [
            models.Index(fields=['code']),
            models.Index(fields=['abbreviation']),
            GinIndex(fields=['tags']),
        ]


class CourseOffering(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_offerings')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='course_offerings')
    year = models.PositiveIntegerField()
    semester = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.course.name} - {self.department.name} ({self.year} / {self.semester})'

    def __repr__(self):
        return f'<CourseOffering {self.course.code} | {self.department.name} | {self.year}/{self.semester}>'

    class Meta:
        db_table = 'course_offerings'
        indexes = [
            models.Index(fields=['course']),
            models.Index(fields=['department']),
            models.Index(fields=['year', 'semester']),
        ]


class CourseAssignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_assignments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_assignments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.get_full_name()} -> {self.course.code}'

    def __repr__(self):
        return f'<CourseAssignment {self.user.email} | {self.course.code}>'

    class Meta:
        db_table = 'course_assignments'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['course']),
        ]
