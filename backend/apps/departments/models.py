import uuid
from typing import Any

from apps.schools.models import School
from django.db import models
from utils.normalization import normalize_capitalization


class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=10)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="departments")
    year = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args: Any, **kwargs: Any) -> None:
        if self.name:
            self.name = normalize_capitalization(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"<Department {self.name} | {self.code}>"

    class Meta:
        db_table = "departments"
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        indexes = [
            models.Index(fields=["school"]),
            models.Index(fields=["name"]),
        ]
        ordering = ["name"]
