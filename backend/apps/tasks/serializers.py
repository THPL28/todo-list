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

    def validate(self, attrs):
        request = self.context.get("request")
        task = attrs.get("task")
        shared_with = attrs.get("shared_with")

        if request is None or task.owner != request.user:
            raise serializers.ValidationError("Only the task owner can share this task.")
        if shared_with == task.owner:
            raise serializers.ValidationError("Task owner cannot share a task with themselves.")
        return attrs
