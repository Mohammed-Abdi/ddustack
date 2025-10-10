# type: ignore
import uuid
from typing import Any

from apps.departments.models import Department
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from utils.normalization import normalize_capitalization


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email=None, password=None, provider=None, provider_id=None, **extra_fields):
        if not email and not (provider and provider_id):
            raise ValueError("Email must be set if not using OAuth provider")
        email = self.normalize_email(email) if email else None
        user = self.model(email=email, provider=provider, provider_id=provider_id, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", User.Role.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("first_name", "Admin")
        extra_fields.setdefault("last_name", "User")
        extra_fields.setdefault("is_verified", True)

        if extra_fields.get("role") != User.Role.ADMIN:
            raise ValueError("Superuser must have role=ADMIN")
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    avatar = models.URLField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True, null=True)
    provider = models.CharField(max_length=255, null=True, blank=True)
    provider_id = models.CharField(max_length=255, null=True, blank=True)

    class Role(models.TextChoices):
        STUDENT = "STUDENT", "student"
        LECTURER = "LECTURER", "lecturer"
        ADMIN = "ADMIN", "admin"
        MODERATOR = "MODERATOR", "moderator"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="users", null=True, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    semester = models.PositiveIntegerField(null=True, blank=True)
    student_id = models.CharField(max_length=30, unique=True, null=True, blank=True)
    staff_id = models.CharField(max_length=30, unique=True, null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def save(self, *args: Any, **kwargs: Any) -> None:
        if self.first_name:
            self.first_name = normalize_capitalization(self.first_name)
        if self.last_name:
            self.last_name = normalize_capitalization(self.last_name)
        if self.email:
            self.email = self.email.lower().strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

    def __repr__(self):
        return f"<User {self.email} | {self.role}>"

    def is_oauth_user(self):
        return self.provider is not None and self.provider_id is not None

    def clean(self):
        super().clean()
        if self.role in [self.Role.LECTURER, self.Role.MODERATOR] and not self.staff_id:
            raise ValidationError({"staff_id": "Staff must have a staff_id"})

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-date_joined"]
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["student_id"]),
            models.Index(fields=["staff_id"]),
            models.Index(fields=["role"]),
        ]
