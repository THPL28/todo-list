from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "recipient",
            "event_type",
            "payload",
            "status",
            "response_body",
            "error_message",
            "created_at",
            "sent_at",
        ]
        read_only_fields = [
            "recipient",
            "event_type",
            "payload",
            "status",
            "response_body",
            "error_message",
            "created_at",
            "sent_at",
        ]
