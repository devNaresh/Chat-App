import React, { Component } from 'react'
import WrappedLoginForm from './containers/Login'
import ChatApp from './containers/Chat'
import WebSocketInstance from './Websocket'
import WrappedSignUpForm from './containers/SignUp'
import {connect} from 'react-redux'
import {addMessage, setMessages} from './store/actions/message'

import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";

class App extends Component {

    constructor(props) {
        super(props)
        WebSocketInstance.addCallbacks(
            this.props.setMessagesMethod.bind(this),
            this.props.addMessageMethod.bind(this)
        )
    }

    render() {
        return (
            <Router>
                <Route exact path='/login/' component={WrappedLoginForm} />
                <Route exact path='/signUp/' component={WrappedSignUpForm} />
                <Route exact path='/' component={ChatApp} />
                <Route path='/chat' component={ChatApp} />
            </Router>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        addMessageMethod: (message) => {
            dispatch(addMessage(message))
        },
        setMessagesMethod: (message) => {
            dispatch(setMessages(message))
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(App)
