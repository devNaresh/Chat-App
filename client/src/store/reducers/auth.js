import * as actionType from '../actions/actionType'
import { updateObject } from '../utils'


const initial_auth_state = {
    isAuthenticated: false,
    user: null,
    error: null,
    loading: false,
    is_token_expired: false
}

const authStartReducer = (state, action) => {
    return updateObject(state, {
        loading: true
    })
}


const loginSuccessReducer = (state, action) => {
    return updateObject(state, {
        loading: false,
        user: action.user,
        isAuthenticated: true
    })
}

const logOutReducer = (state, action) => {
    return updateObject(state, {
        isAuthenticated: false,
        user: null
    })
}

const loginFailedReducer = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    })
}

const reducer = (state = initial_auth_state, action) => {
    switch (action.type) {
        case actionType.AUTH_START: return authStartReducer(state, action)
        case actionType.LOGIN_SUCCESS: return loginSuccessReducer(state, action)
        case actionType.LOGOUT: return logOutReducer(state, action)
        case actionType.LOGIN_FAILED: return loginFailedReducer(state, action)
        default: return state
    }
}

export default reducer
