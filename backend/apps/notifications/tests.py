import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from apps.notifications.models import Notification
from apps.notifications.services import NotificationService

User = get_user_model()


@pytest.mark.django_db
def test_notification_service_creates_and_sends_notification(monkeypatch):
    user = User.objects.create_user(username="notifyuser", password="password123")
    notification = Notification.objects.create(
        recipient=user,
        event_type=Notification.EVENT_TASK_SHARED,
        payload={"task_id": 1},
    )

    class DummyResponse:
        ok = True
        status_code = 200
        headers = {"content-type": "application/json"}

        @staticmethod
        def json():
            return {"result": "ok"}

    def fake_post(url, json, headers, timeout):
        return DummyResponse()

    monkeypatch.setattr("apps.notifications.services.requests.post", fake_post)
    result = NotificationService.send(notification)

    assert result.status == Notification.STATUS_SENT
    assert result.response_body == {"result": "ok"}
    assert result.error_message == ""
    assert result.sent_at is not None


@pytest.mark.django_db
def test_notification_service_marks_failed_status(monkeypatch):
    user = User.objects.create_user(username="notifyuser2", password="password123")
    notification = Notification.objects.create(
        recipient=user,
        event_type=Notification.EVENT_TASK_SHARED,
        payload={"task_id": 2},
    )

    class DummyResponse:
        ok = False
        status_code = 500
        text = "Server error"
        headers = {"content-type": "application/json"}

        @staticmethod
        def json():
            return {"error": "server_error"}

    def fake_post(url, json, headers, timeout):
        return DummyResponse()

    monkeypatch.setattr("apps.notifications.services.requests.post", fake_post)
    result = NotificationService.send(notification)

    assert result.status == Notification.STATUS_FAILED
    assert "500" in result.error_message
    assert result.sent_at is not None
