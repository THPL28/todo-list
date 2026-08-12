from .models import Category


def create_category(owner, name: str) -> Category:
    return Category.objects.create(owner=owner, name=name)
