from .models import Task, TaskShare


def create_task(owner, **kwargs) -> Task:
    return Task.objects.create(owner=owner, **kwargs)


def share_task(task, shared_with, can_edit=False) -> TaskShare:
    share, _ = TaskShare.objects.update_or_create(
        task=task,
        shared_with=shared_with,
        defaults={"can_edit": can_edit},
    )
    return share
