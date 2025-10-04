# type: ignore
from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "role",
            "is_active",
            "is_staff",
            "department_id",
            "year",
            "semester",
            "date_joined",
            "updated_at",
        ]
        read_only_fields = ["id", "role", "is_active", "is_staff", "date_joined", "updated_at"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "password", "department_id", "year", "semester"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


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
            "department_id",
            "year",
            "semester",
            "date_joined",
            "updated_at",
        ]
        read_only_fields = ["id", "date_joined", "updated_at"]
