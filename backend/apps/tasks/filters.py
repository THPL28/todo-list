import django_filters
from django_filters import rest_framework as filters
from .models import Task


class TaskFilter(filters.FilterSet):
    status = django_filters.BooleanFilter(field_name="is_completed")
    title = django_filters.CharFilter(field_name="title", lookup_expr="icontains")
    start_date = django_filters.DateFilter(field_name="due_date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="due_date", lookup_expr="lte")
    category = django_filters.NumberFilter(field_name="category_id")

    class Meta:
        model = Task
        fields = ["status", "title", "start_date", "end_date", "category"]
