import * as actionTypes from './actionType'
import { axiosInstance } from '../utils'

export const addMessage = (message) => {
    return {
        type: actionTypes.ADD_MESSAGE,
        message: message
    }
}

export const setMessages = (messages) => {
    return {
        type: actionTypes.SET_MESSAGES,
        messages: messages
    }
}

export const getChatSuccess = (chats, username) => {
    let userChats = []
    chats.forEach(element => {
        if(!element.is_group && element.paticipants.length > 1){
            userChats.push({
                chatId: element.id,
                chatName: element.paticipants.find(participant=>participant.username!==username).username
            })
        }
        else if(element.paticipants.length > 1) {
            userChats.push({
                chatId: element.id,
                chatName: element.name
            })
        }
    });
    return {
        type: actionTypes.GET_CHATS_SUCCESS,
        chats: userChats
    }
}


export const getChats = (username) => {
    return dispatch => {
        axiosInstance.get(`chat/${username}/`
        ).then((res) => {
            dispatch(getChatSuccess(res.data, username))
        }).catch(error => console.log(error))
    }
}