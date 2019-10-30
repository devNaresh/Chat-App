import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/auth';
import messageReducer from './reducers/message';
import axios from 'axios';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
    auth: authReducer,
    message: messageReducer
})

const store = createStore(reducer,  composeEnhancers(applyMiddleware(thunk)))
export default store
