from django.urls import path, URLPattern
from .views import summarize_lecture

urlpatterns: list[URLPattern] = [
    path('summarizer/', summarize_lecture, name="summarizer"),
]
