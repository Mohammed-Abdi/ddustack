# type: ignore
from rest_framework import serializers

from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "id",
            "code",
            "name",
            "abbreviation",
            "description",
            "status",
            "credit_points",
            "lecture_hours",
            "lab_hours",
            "tutorial_hours",
            "homework_hours",
            "credit_hours",
            "tags",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
