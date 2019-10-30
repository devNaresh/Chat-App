from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class ChatUser(models.Model):
    user = models.ForeignKey(User, related_name='chat_user', on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.user.username

    def get_friends(self):
        return [chatuser.user for chatuser in self.friends.all()]


class Chat(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    is_group = models.BooleanField(default=False)
    paticipants = models.ManyToManyField(ChatUser, related_name='chat_group', blank=True)

    def get_paticipants(self):
        return [paticipant.user for paticipant in self.paticipants.all()]

    def last_10_messages(chatId):
        chat_obj = Chat.objects.get(id=chatId)
        return chat_obj.messages_set.order_by('-timestamp').all()[:10]


class Messages(models.Model):
    author = models.ForeignKey(User, related_name='author_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    chat = models.ForeignKey(Chat, on_delete=None)

    def __str__(self):
        return self.author.username
