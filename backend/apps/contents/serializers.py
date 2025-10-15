#type: ignore
from rest_framework import serializers
from .models import Content
from apps.users.models import User


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'avatar', 'is_verified']


class ContentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSummarySerializer(read_only=True)

    class Meta:
        model = Content
        fields = [
            "id",
            "course",
            "title",
            "type",
            "path",
            "chapter",
            "file",
            "tags",
            "uploaded_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "uploaded_by"]
