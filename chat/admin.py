from django.contrib import admin
from chat.models import Chat, ChatUser, Messages
# Register your models here.
admin.site.register(Chat)
admin.site.register(ChatUser)
admin.site.register(Messages)
