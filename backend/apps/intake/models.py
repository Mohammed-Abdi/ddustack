import uuid
from typing import Any

from apps.users.models import User
from django.db import models


class Intake(models.Model):
    class Type(models.TextChoices):
        ACCESS = "ACCESS", "Access"
        ROLE_CHANGE = "ROLE_CHANGE", "Role Change"
        DATA_UPDATE = "DATA_UPDATE", "Data Update"
        COURSE_ASSIGNMENT = "COURSE_ASSIGNMENT", "Course Assignment"
        COMPLAIN = "COMPLAIN", "Complain"
        FEEDBACK = "FEEDBACK", "Feedback"
        LEAVE = "LEAVE", "Leave"
        GRADE_REVIEW = "GRADE_REVIEW", "Grade Review"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        REJECTED = "REJECTED", "Rejected"
        APPROVED = "APPROVED", "Approved"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="intakes")
    type = models.CharField(max_length=30, choices=Type.choices, default=Type.ACCESS)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    full_name = models.CharField(max_length=150, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    staff_id = models.CharField(max_length=50, null=True, blank=True)
    student_id = models.CharField(max_length=50, null=True, blank=True)
    department_id = models.CharField(max_length=50, null=True, blank=True)

    description = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "intake"
        ordering: list[Any] = [
            models.Case(
                models.When(status="PENDING", then=0),
                models.When(status="REJECTED", then=1),
                models.When(status="APPROVED", then=2),
                output_field=models.IntegerField(),
            ),
            "created_at",
        ]
        indexes = [
            models.Index(fields=["type"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"{self.full_name} - {self.type} ({self.status})"
