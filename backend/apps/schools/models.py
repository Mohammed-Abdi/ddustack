import uuid
from typing import Any

from django.db import models
from utils.normalization import normalize_capitalization


class School(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args: Any, **kwargs: Any):
        if self.name:
            self.name = normalize_capitalization(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"<School {self.name} | {self.id}>"

    class Meta:
        db_table = "schools"
        verbose_name = "School"
        verbose_name_plural = "Schools"
