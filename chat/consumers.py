# chat/consumers.py
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from chat.serializer import MessageSerializer
from chat.models import Chat


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if text_data_json["action"] == "fetch_old_messages":
            self.fetch_messages(text_data_json["chatId"])
        elif text_data_json["action"] == "message":
            serializer = MessageSerializer(data=text_data_json)
            serializer.is_valid()
            serializer.save()

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': serializer.data
                }
            )

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'command': 'new_message',
            'message': message
        }))

    def fetch_messages(self, chatId):
        queryset = Chat.last_10_messages(chatId)
        serializer = MessageSerializer(queryset, many=True)

        self.send(text_data=json.dumps({
            'command': 'messages',
            'messages': serializer.data
        }))
