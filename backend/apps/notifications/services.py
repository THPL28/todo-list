import os
import requests
from django.utils import timezone
from .models import Notification


class NotificationService:
    api_base_url = os.getenv("EXTERNAL_NOTIFICATION_API_URL", "https://example.com/notifications")
    api_token = os.getenv("EXTERNAL_NOTIFICATION_API_TOKEN", "")
    timeout = int(os.getenv("EXTERNAL_NOTIFICATION_API_TIMEOUT", "5"))

    @classmethod
    def send(cls, notification: Notification) -> Notification:
        payload = {
            "recipient_id": notification.recipient.id,
            "event_type": notification.event_type,
            "payload": notification.payload,
        }
        headers = {
            "Content-Type": "application/json",
        }
        if cls.api_token:
            headers["Authorization"] = f"Bearer {cls.api_token}"

        try:
            response = requests.post(
                cls.api_base_url,
                json=payload,
                headers=headers,
                timeout=cls.timeout,
            )
            notification.response_body = response.json() if response.headers.get("content-type", "").startswith("application/json") else {"status_code": response.status_code}
            notification.status = Notification.STATUS_SENT if response.ok else Notification.STATUS_FAILED
            if not response.ok:
                notification.error_message = f"{response.status_code}: {response.text}"
        except Exception as exc:
            notification.status = Notification.STATUS_FAILED
            notification.error_message = str(exc)
            notification.response_body = {}
        notification.sent_at = timezone.now()
        notification.save(update_fields=["status", "response_body", "error_message", "sent_at"])
        return notification

    @classmethod
    def create_and_send(cls, recipient, event_type, payload):
        notification = Notification.objects.create(
            recipient=recipient,
            event_type=event_type,
            payload=payload,
            status=Notification.STATUS_PENDING,
        )
        return cls.send(notification)
