import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux'
import ChatApp from './containers/Chat';
import store from './store'
import App from './App'


const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
