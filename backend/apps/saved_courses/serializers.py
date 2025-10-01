# type: ignore
from rest_framework import serializers

from .models import SavedCourse


class SavedCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedCourse
        fields = ["id", "user_id", "course_id", "saved_at"]
        read_only_fields = ["id", "user_id", "saved_at"]
