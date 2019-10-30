import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logOut } from '../store/actions/auth'
import { getChats } from '../store/actions/message'
import { withRouter } from 'react-router-dom'
import FriendsModalForm from './Friends'
import Contacts from '../components/Contacts'
import { axiosInstance } from '../store/utils'

export class Sidepanel extends Component {

  state = {
    visible: false,
    users: []
  }

  onLogoutClick = () => {
    this.props.signOut()
    this.props.history.push('/login')
  }

  handleCancel = () => {
    this.setState({ visible: false });
  };

  onEditFriendsClick = () => {
    let users = []
    axiosInstance.get("signUp/").then((response) => {
      response.data.forEach(element => {
        let is_friend = this.props.chats.some(chats=>chats.chatName===element.username)
        if(is_friend){
          users.push({
            ...element,
            friend: true
          })
        }
        else if(element.username!=this.props.user.username) {
          users.push({
            ...element,
            friend: false
          })
        }
      });
      this.setState({ 
        visible: true,
        users: users
      })
    })
  }

  handleCreate = () => {
    const { form } = this.formRef.props;
    let friends = []
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values)
      values["checkbox-group"].forEach(element => {
        if (element.username != this.props.user.username)
          friends.push({
            username: element.username
          })
      });
      axiosInstance.put(`/user/${this.props.user.username}/`, {friends})
        .then(res =>
          this.props.getUserChats(this.props.user.username))
      form.resetFields();
      this.setState({ visible: false });
    });
  };


  componentWillMount() {
    this.props.getUserChats(this.props.user.username)
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    let userActiveChats = this.props.chats.map(element => (
      <Contacts
        key={element.chatId}
        chatname={element.chatName}
        chatURL={`${element.chatId}`}
      />)
    )
    return (
      <div>
        <FriendsModalForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          users={this.state.users}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />

        <div id="sidepanel">
          <div id="profile">
            <div className="wrap">
              <img id="profile-img" src="https://www.netfort.com/assets/user.png" className="online" alt="" />
              <p>{this.props.user.username}</p>
            </div>
          </div>
          <div id="search">
            <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
            <input type="text" placeholder="Search contacts..." />
          </div>
          <div id="contacts">
            <ul>
              {userActiveChats}
            </ul>
          </div>
          <div id="bottom-bar">
            <button id="addcontact" onClick={this.onEditFriendsClick}><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Edit Friends</span></button>
            <button id="logout" onClick={this.onLogoutClick}><i className="fa fa-sign-out fa-fw" aria-hidden="true"></i> <span>Logout</span></button>
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    user: state.auth.user,
    chats: state.message.chats
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => {
      dispatch(logOut())
    },
    getUserChats: (username) => {
      dispatch(getChats(username))
    }
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidepanel))