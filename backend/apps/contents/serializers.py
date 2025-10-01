# type: ignore
from rest_framework import serializers

from .models import Content


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ["id", "course_id", "title", "type", "path", "chapter", "file", "tags", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
