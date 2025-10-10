# type: ignore
from rest_framework import serializers

from .models import CourseAssignment


class CourseAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseAssignment
        fields = ["id", "user", "course", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
