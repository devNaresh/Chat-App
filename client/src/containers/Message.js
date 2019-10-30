import React, { Component } from 'react'
import { connect } from 'react-redux'
import WebSocketInstance from '../Websocket'

export class Message extends Component {
    state = {
        message: ""
    }

    constructor(props) {
        super(props);
        this.messageRef = React.createRef();
    }

    componentWillMount() {
        if (WebSocketInstance.state() != 1) {
            WebSocketInstance.connect(this.props.match.params.chatID)
            this.waitForWebsocketConnection(() => {
                WebSocketInstance.fetchMessages(this.props.match.params.chatID)
            })
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.chatID !== newProps.match.params.chatID) {
            WebSocketInstance.disconnect();
            WebSocketInstance.connect(newProps.match.params.chatID);
            this.waitForWebsocketConnection(() => {
                WebSocketInstance.fetchMessages(this.props.match.params.chatID)
            });
        }
    }

    componentDidUpdate() {
        this.messageRef.current.scrollTop = this.messageRef.current.scrollHeight;
    }

    waitForWebsocketConnection(callback) {
        const component = this
        setTimeout(() => {
            if (WebSocketInstance.state() == 1) {
                console.log("Connection made successfull")
                callback()
            }
            else {
                console.log("wait for connection...");
                component.waitForWebsocketConnection(callback);
            }
        }, 100);
    }

    handleKeyPress = event => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            this.sendMessage(event)
        }
    }

    sendMessage = (event) => {
        event.preventDefault();
        WebSocketInstance.newChatMessage({
            message: this.state.message,
            chatId: this.props.match.params.chatID,
            author: this.props.username
        })
        this.setState({ message: "" })
    }

    messageChangeHandler = event => {
        this.setState({ message: event.target.value });
    }

    getMessages = () => {
        return this.props.messages.map(element => {
            return (
                <li className={element.author === this.props.username ? "sent" : "replies"}>
                    <img src="https://www.netfort.com/assets/user.png" alt="" />
                    <p>{element.message}</p>
                </li>
            )
        })
    }

    getActiveUser = () => {
      let chat = this.props.chats.find(chat=>chat.chatId==this.props.match.params.chatID)
      if (chat) {
        return chat.chatName
      }
      else {
        return undefined
      }
    }

    render() {
        return (
            <div>
                <div className="contact-profile">
                  <img src="https://www.netfort.com/assets/user.png" alt="" />
                  <p>{this.getActiveUser()}</p>
                </div>

                <div className="messages" ref={this.messageRef}>
                    <ul>
                        {this.getMessages()}
                    </ul>
                </div>

                <div className="message-input">
                    <div className="wrap">

                        <input type="text"
                            placeholder="Write your message..."
                            onKeyPress={this.handleKeyPress}
                            onChange={this.messageChangeHandler}
                            value={this.state.message} />
                        <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                        <button className="submit" onClick={this.sendMessage}><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        messages: state.message.messages,
        username: state.auth.user.username,
        chats: state.message.chats
    }
}


const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(
    mapStateToProps,
    null
)(Message)
