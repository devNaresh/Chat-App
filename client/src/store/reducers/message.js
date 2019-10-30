import * as actionType from '../actions/actionType'
import { updateObject } from '../utils'


const initial_message_state = {
    messages: [],
    chats: []
}

const addMessage = (state, action) => {
    return updateObject(state, {
        messages: [...state.messages, action.message]
    })
}

const setMessages = (state, action) => {
    return updateObject(state, {
        messages: action.messages.reverse()
    })
}

const getChats = (state, action) => {
    return updateObject(state, {
        chats: action.chats
    })
}


const reducer = (state = initial_message_state, action) => {
    switch (action.type) {
        case actionType.SET_MESSAGES: return setMessages(state, action)
        case actionType.ADD_MESSAGE: return addMessage(state, action)
        case actionType.GET_CHATS_SUCCESS: return getChats(state, action)
        default: return state
    }
}

export default reducer
