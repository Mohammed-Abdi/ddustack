# type: ignore
from rest_framework import serializers

from .models import SavedCourse


class SavedCourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = SavedCourse
        fields = ["id", "user", "course", "saved_at"]
        read_only_fields = ["id", "saved_at"]
