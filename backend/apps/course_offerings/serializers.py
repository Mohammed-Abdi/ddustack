# type: ignore
from rest_framework import serializers

from .models import CourseOffering


class CourseOfferingSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseOffering
        fields = [
            "id",
            "course",
            "department",
            "year",
            "semester",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
