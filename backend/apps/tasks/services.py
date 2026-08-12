from .models import Task


def create_task(owner, **kwargs) -> Task:
    return Task.objects.create(owner=owner, **kwargs)
