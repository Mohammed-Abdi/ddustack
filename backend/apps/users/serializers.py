# type: ignore
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.conf import settings

from .models import User


class UserSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "department",
            "year",
            "semester",
            "user_id",
            "is_verified",
            "date_joined",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "role",
            "date_joined",
            "updated_at",
            "user_id",
            "is_verified",
        ]

    def get_user_id(self, obj: User):
        if obj.role == User.Role.STUDENT:
            return obj.student_id
        if obj.role in [User.Role.LECTURER, User.Role.MODERATOR, User.Role.ADMIN]:
            return obj.staff_id
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
        default=settings.REG_PASSWORD_DEFAULT,
    )

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'password',
            'department',
            'year',
            'semester',
            'role',
            'is_active',
            'is_verified',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', settings.REG_PASSWORD_DEFAULT)
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        if email and password:
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials.")
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")
            attrs["user"] = user
            return attrs
        raise serializers.ValidationError("Must include 'email' and 'password'.")


class AdminUserSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "provider",
            "provider_id",
            "role",
            "is_active",
            "is_staff",
            "department",
            "year",
            "semester",
            "user_id",
            "is_verified",
            "date_joined",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "date_joined",
            "updated_at",
            "user_id",
        ]

    def get_user_id(self, obj: User):
        if obj.role == User.Role.STUDENT:
            return obj.student_id
        if obj.role in [User.Role.LECTURER, User.Role.MODERATOR, User.Role.ADMIN]:
            return obj.staff_id
        return None


class ResetPasswordSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()

    def validate_user_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("User not found.")
        return value