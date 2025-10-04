# type: ignore
import uuid

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, provider=None, provider_id=None, **extra_fields):
        if not email and not (provider and provider_id):
            raise ValueError("The Email must be set if not using OAuth provider")
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

        if extra_fields.get("role") != User.Role.ADMIN:
            raise ValueError("Superuser must have role=ADMIN")
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)

    # ---------------------------
    # Personal info
    # ---------------------------
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    # ---------------------------
    # OAuth / Authentication provider
    # ---------------------------
    provider = models.CharField(max_length=255, null=True, blank=True)
    provider_id = models.CharField(max_length=255, null=True, blank=True)

    # ---------------------------
    # Role
    # ---------------------------
    class Role(models.TextChoices):
        STUDENT = "STUDENT", "student"
        LECTURER = "LECTURER", "Lecturer"
        ADMIN = "ADMIN", "admin"
        MODERATOR = "MODERATOR", "moderator"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)

    # ---------------------------
    # Status
    # ---------------------------
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # ---------------------------
    # Academic info
    # ---------------------------
    department_id = models.UUIDField(null=True, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    semester = models.PositiveIntegerField(null=True, blank=True)

    # ---------------------------
    # Timestamps
    # ---------------------------
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ---------------------------
    # Manager
    # ---------------------------
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

    def is_oauth_user(self):
        return self.provider is not None and self.provider_id is not None

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"
