from rest_framework import serializers
from chat.models import Messages, Chat, ChatUser
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        ChatUser.objects.create(user=user)
        return user

    def to_internal_value(self, data):
        if isinstance(self.root, ChatUserSerializer):
            return ChatUser.objects.get(user__username=data["username"])
        else:
            return super().to_internal_value(data)


class ChatUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    friends = UserSerializer(many=True, source='get_friends')

    class Meta:
        model = ChatUser
        fields = '__all__'

    def update(self, instance, validated_data):
        current_friends = instance.friends.all()
        new_friends = [friend for friend in validated_data["get_friends"] if friend not in current_friends]
        delete_friends = [friend for friend in current_friends if friend not in validated_data["get_friends"]]
        for friend in new_friends:
            obj = Chat.objects.create()
            obj.paticipants.set([instance, friend])
            instance.friends.add(friend)
        for friend in delete_friends:
            friend.chat_group.clear()
            instance.friends.remove(friend)
        return instance


class ChatSerializer(serializers.ModelSerializer):
    paticipants = UserSerializer(read_only=True, many=True, source='get_paticipants')

    class Meta:
        model = Chat
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all())
    message = serializers.CharField(source='content')
    chatId = serializers.PrimaryKeyRelatedField(source='chat', queryset=Chat.objects.all())

    class Meta:
        model = Messages
        fields = ['id', 'author', 'message', 'timestamp', 'chatId']
