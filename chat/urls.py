# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path("signUp/", views.CreateUserView.as_view(), name='create_user'),
    path("chat/<str:username>/", views.ChatView.as_view()),
    path("user/<str:username>/", views.ChatUserUpdateView.as_view())
]
