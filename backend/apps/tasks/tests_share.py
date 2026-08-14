import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.categories.models import Category
from .models import Task, TaskShare

User = get_user_model()


@pytest.mark.django_db
def test_task_sharing_read_and_edit_permissions():
    owner = User.objects.create_user(username="owner", password="password123")
    viewer = User.objects.create_user(username="viewer", password="password123")
    editor = User.objects.create_user(username="editor", password="password123")

    task = Task.objects.create(owner=owner, title="Shared Task", description="Desc")
    TaskShare.objects.create(task=task, shared_with=viewer, can_edit=False)
    TaskShare.objects.create(task=task, shared_with=editor, can_edit=True)

    viewer_client = APIClient()
    viewer_client.force_authenticate(user=viewer)
    editor_client = APIClient()
    editor_client.force_authenticate(user=editor)

    response = viewer_client.get(f"/api/tasks/{task.id}/")
    assert response.status_code == 200

    response = viewer_client.patch(f"/api/tasks/{task.id}/", {"title": "New"}, format="json")
    assert response.status_code == 403

    response = editor_client.patch(f"/api/tasks/{task.id}/", {"title": "Edited"}, format="json")
    assert response.status_code == 200
    assert response.data["title"] == "Edited"


@pytest.mark.django_db
def test_owner_can_share_a_task_using_username(monkeypatch):
    owner = User.objects.create_user(username="share-owner", password="password123")
    recipient = User.objects.create_user(username="recipient", password="password123")
    task = Task.objects.create(owner=owner, title="Task to share")
    client = APIClient()
    client.force_authenticate(user=owner)

    monkeypatch.setattr(
        "apps.tasks.views.NotificationService.create_and_send",
        lambda **kwargs: None,
    )
    response = client.post(
        "/api/task-shares/",
        {"task": task.id, "shared_with_username": recipient.username, "can_edit": False},
        format="json",
    )

    assert response.status_code == 201
    assert response.data["shared_with"] == recipient.id
    assert TaskShare.objects.filter(task=task, shared_with=recipient, can_edit=False).exists()
