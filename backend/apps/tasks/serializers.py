from rest_framework import serializers
from .models import Task, TaskShare


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "is_completed",
            "due_date",
            "category",
            "owner",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["owner", "created_at", "updated_at"]


class TaskShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskShare
        fields = ["id", "task", "shared_with", "can_edit", "created_at"]
        read_only_fields = ["created_at"]
