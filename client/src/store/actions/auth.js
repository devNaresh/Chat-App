import * as actionTypes from './actionType'
import jwt_decode from 'jwt-decode'
import { axiosInstance } from '../utils'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const loginFailed = (error) => {
    return {
        type: actionTypes.LOGIN_FAILED,
        error: error
    }
}

export const loginSuccess = () => {
    let bas64_data = jwt_decode(localStorage.getItem("access_token"))
    return {
        type: actionTypes.LOGIN_SUCCESS,
        user: {
            'user_id': bas64_data['user_id'],
            'username': bas64_data['username']
        }
    }
}

export const logOut = () => {
    return dispatch => {
        localStorage.setItem("access_token", undefined)
        localStorage.setItem("refresh_token", undefined)
        dispatch({ type: actionTypes.LOGOUT })
    }
}

export const login = (username, password) => {
    return dispatch => {
        dispatch(authStart())

        axiosInstance.post('/api/token/', {
            username,
            password
        }, { withCredentials: true }).then(res => {
            localStorage.setItem("access_token", res.data.access)
            localStorage.setItem("refresh_token", res.data.refresh)
            dispatch(loginSuccess())
        }).catch(error => {
            dispatch(loginFailed(error.message))
        })
    }
}


export const userSignUp = (username, email, password, history) => {
    return dispatch => {
        dispatch(authStart())

        axiosInstance.post('/signUp/', {
            username,
            email,
            password
        }, { withCredentials: true }).then(res => {
            history.push('/login/')
        }).catch(error => {
            dispatch(loginFailed(error))
        })
    }
}


export const checkAuthentication = (history) => {
    return dispatch => {
        dispatch(authStart())
        
        let refresh_token = localStorage.getItem('refresh_token')
        axiosInstance.post('/api/token/refresh/', {
            refresh: refresh_token
        }).then(res => {
            if (res.status === 200)  {
                localStorage.setItem("access_token", res.data.access)
                dispatch(loginSuccess())
            }
        }).catch(error => {
            dispatch(loginFailed(error))
            history.push('/login/')
        })
    }
}