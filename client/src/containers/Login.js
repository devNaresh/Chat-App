import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from 'react-redux'
import { login } from '../store/actions/auth'
import { NavLink, withRouter } from 'react-router-dom'


const loginFormStyle = {
    loginStyle: {
        marginTop: "20%",
        marginLeft: "40%",
        marginRight: "40%",
        positon: "absolute",
        widht: "100%"
    },
    loginButton: {
        width: "100%"
    }
}


class LoginForm extends React.Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.authenticate(values.username, values.password)
            }
            this.props.history.push('/')
        });
    };

    com
    
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form" style={loginFormStyle.loginStyle}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" style={loginFormStyle.loginButton}>
                        Log in
                    </Button>
                    Or <NavLink to="/signUp/">register now!</NavLink>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedLoginForm = Form.create()(LoginForm)

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        authenticate: (username, password) => {
            dispatch(login(username, password))
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedLoginForm))
