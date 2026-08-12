import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.categories.models import Category

User = get_user_model()


@pytest.mark.django_db
def test_task_crud_with_filters_and_pagination():
    user = User.objects.create_user(username="taskuser", password="password123")
    client = APIClient()
    client.force_authenticate(user=user)

    category = Category.objects.create(owner=user, name="Home")

    response = client.post(
        "/api/tasks/",
        {
            "title": "Buy groceries",
            "description": "Milk and eggs",
            "is_completed": False,
            "due_date": "2026-08-31",
            "category": category.id,
        },
        format="json",
    )
    assert response.status_code == 201
    task_id = response.data["id"]

    response = client.get("/api/tasks/?status=false&category=%s" % category.id)
    assert response.status_code == 200
    assert response.data["results"][0]["id"] == task_id

    response = client.patch(f"/api/tasks/{task_id}/", {"is_completed": True}, format="json")
    assert response.status_code == 200
    assert response.data["is_completed"] is True

    response = client.delete(f"/api/tasks/{task_id}/")
    assert response.status_code == 204
