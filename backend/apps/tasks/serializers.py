from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task, TaskShare

User = get_user_model()


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
    shared_with = serializers.PrimaryKeyRelatedField(read_only=True)
    shared_with_username = serializers.SlugRelatedField(
        source="shared_with",
        slug_field="username",
        queryset=User.objects.all(),
        write_only=True,
    )

    class Meta:
        model = TaskShare
        fields = ["id", "task", "shared_with", "shared_with_username", "can_edit", "created_at"]
        read_only_fields = ["created_at"]

    def validate(self, attrs):
        request = self.context.get("request")
        task = attrs.get("task")
        shared_with = attrs.get("shared_with")

        if request is None or task.owner != request.user:
            raise serializers.ValidationError("Only the task owner can share this task.")
        if shared_with == task.owner:
            raise serializers.ValidationError("Task owner cannot share a task with themselves.")
        return attrs
