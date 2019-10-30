# chat/views.py
from django.contrib.auth import get_user_model
from rest_framework.generics import (CreateAPIView, ListAPIView,
                                     ListCreateAPIView, RetrieveAPIView,
                                     RetrieveUpdateAPIView)

from chat.models import Chat, ChatUser
from chat.serializer import ChatSerializer, ChatUserSerializer, UserSerializer
from django.views.generic import TemplateView


class CreateUserView(ListCreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class ChatView(ListAPIView):
    serializer_class = ChatSerializer

    def get_queryset(self):
        return Chat.objects.filter(paticipants__user__username=self.kwargs["username"])


class ChatUserUpdateView(RetrieveUpdateAPIView):
    serializer_class = ChatUserSerializer
    lookup_field = "user__username"
    lookup_url_kwarg = "username"
    queryset = ChatUser.objects.all()


class Home(TemplateView):
    template_name = 'index.html'
