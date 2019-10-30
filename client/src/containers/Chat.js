import React, { Component } from 'react';
import { connect } from 'react-redux'
import Sidepanel from './Sidepanel'
import Message from './Message'
import { checkAuthentication } from '../store/actions/auth'
import { withRouter } from 'react-router-dom'
import '../assert/chat.css'
import { Route } from "react-router-dom";

export class ChatApp extends Component {

  componentWillMount() {
    if (!this.props.loading){
      this.props.autoLogin(this.props.history)
    }
  }

  render() {
    return (
      this.props.isAuthenticated ?
       (<div id='frame' >
        <Sidepanel />
        <div className="content">
          <Route exact path={`${this.props.match.url}/:chatID/`} component={Message} />
        </div>
      </div>): null
    )
  }
}


const mapStateToProps = state => {
  return {
      isAuthenticated: state.auth.isAuthenticated,
      loading: state.auth.loading,
      user: state.auth.user
  }
}


const mapDispatchToProps = dispatch => {
  return {
       autoLogin: (history) => {
           dispatch(checkAuthentication(history))
       }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatApp))
