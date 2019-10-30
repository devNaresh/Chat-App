// import { SOCKET_URL } from "./settings";

class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
    this.isDisconnected=false;
  }

  connect(chatUrl) {
    const path = `ws://127.0.0.1:8000/ws/chat/${chatUrl}/`;
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log("WebSocket open");
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };
    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      if(!this.isDisconnected) this.connect(chatUrl);
    };
  }

  disconnect() {
    this.isDisconnected = true
    this.socketRef.close();
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "messages") {
      this.callbacks[command](parsedData.messages);
    }
    if (command === "new_message") {
      this.callbacks[command](parsedData.message);
    }
  }

  fetchMessages(chatId) {
    this.sendMessage({
      action: 'fetch_old_messages',
      chatId: chatId
    });
  }

  newChatMessage(message) {
    this.sendMessage({
      action: "message",
      author: message.author,
      message: message.message,
      chatId: message.chatId
    });
  }

  addCallbacks(messagesCallback, newMessageCallback) {
    this.callbacks["messages"] = messagesCallback;
    this.callbacks["new_message"] = newMessageCallback;
  }

  sendMessage(data) {
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    if(this.socketRef) return this.socketRef.readyState;
    return 3
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
