import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from 'react-redux'
import { userSignUp } from '../store/actions/auth'
import { withRouter } from 'react-router-dom'


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


class SignUpForm extends React.Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("Hello Gii")
      if (!err) {
        this.props.signUp(values.username, values.email, values.password, this.props.history)
      }
      else this.props.history.push('/signUp/')
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

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
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your Password!'
              },
              {
                validator: this.validateToNextPassword,
              }
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('confirmPassword', {
            rules: [
              {
                required: true,
                message: 'Please confirm your Password!'
              },
              {
                validator: this.compareToFirstPassword,
              }
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign Up
                    </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedSignUpForm = Form.create()(SignUpForm)

const mapDispatchToProps = dispatch => {
  return {
    signUp: (username, email, password, history) => {
      dispatch(userSignUp(username, email, password, history))
    }
  }
}

export default withRouter(connect(
  null,
  mapDispatchToProps
)(WrappedSignUpForm))
