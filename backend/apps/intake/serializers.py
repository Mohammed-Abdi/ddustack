# type: ignore
from rest_framework import serializers

from .models import Intake


class IntakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intake
        fields = [
            "id",
            "user",
            "type",
            "status",
            "created_at",
            "updated_at",
            "full_name",
            "phone_number",
            "staff_id",
            "student_id",
            "department",
            "description",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at", "user"]

    def validate(self, data):
        request_type = data.get("type") or getattr(self.instance, "type", None)

        if request_type == "ACCESS":
            missing = []
            if not data.get("full_name") and not getattr(self.instance, "full_name", None):
                missing.append("full_name")
            if not data.get("phone_number") and not getattr(self.instance, "phone_number", None):
                missing.append("phone_number")
            if not data.get("staff_id") and not getattr(self.instance, "staff_id", None):
                missing.append("staff_id")
            if missing:
                raise serializers.ValidationError({field: f"{field} is required for ACCESS requests." for field in missing})

        elif request_type == "ROLE_CHANGE":
            if not data.get("description") and not getattr(self.instance, "description", None):
                raise serializers.ValidationError({"description": "Description is required for ROLE_CHANGE requests."})

        elif request_type == "DATA_UPDATE":
            pass

        elif request_type == "COURSE_ASSIGNMENT":
            if not data.get("staff_id") and not getattr(self.instance, "staff_id", None):
                raise serializers.ValidationError({"staff_id": "Staff ID is required for COURSE_ASSIGNMENT requests."})

        elif request_type == "COMPLAIN":
            if not data.get("description") and not getattr(self.instance, "description", None):
                raise serializers.ValidationError({"description": "Description is required for COMPLAIN requests."})

        elif request_type == "FEEDBACK":
            if not data.get("description") and not getattr(self.instance, "description", None):
                raise serializers.ValidationError({"description": "Description is required for FEEDBACK requests."})

        elif request_type == "LEAVE":
            missing = []
            if not data.get("staff_id") and not getattr(self.instance, "staff_id", None):
                missing.append("staff_id")
            if not data.get("description") and not getattr(self.instance, "description", None):
                missing.append("description")
            if missing:
                raise serializers.ValidationError({field: f"{field} is required for LEAVE requests." for field in missing})

        elif request_type == "GRADE_REVIEW":
            missing = []
            if not data.get("full_name") and not getattr(self.instance, "full_name", None):
                missing.append("full_name")
            if not data.get("department") and not getattr(self.instance, "department", None):
                missing.append("department")
            if not data.get("student_id") and not getattr(self.instance, "student_id", None):
                missing.append("student_id")
            if missing:
                raise serializers.ValidationError({field: f"{field} is required for GRADE_REVIEW requests." for field in missing})

        elif request_type == "OTHER":
            pass

        return data
