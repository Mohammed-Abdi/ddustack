# type: ignore
from apps.users.models import User
from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    user_id = serializers.ListField(child=serializers.UUIDField(), required=False, write_only=True)
    all_users = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = Notification
        fields = ["id", "user_id", "title", "message", "type", "is_read", "all_users", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at", "is_read"]

    def create(self, validated_data):
        all_users = validated_data.pop("all_users", False)
        user_ids = validated_data.pop("user_id", [])

        notifications = []

        if all_users:
            users = User.objects.filter(is_active=True)
            for user in users:
                note = Notification.objects.create(user_id=user, **validated_data)
                notifications.append(note)
        else:
            for uid in user_ids:
                user = User.objects.get(id=uid)
                note = Notification.objects.create(user_id=user, **validated_data)
                notifications.append(note)

        return notifications[0] if notifications else None
