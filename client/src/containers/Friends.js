import React, { Component } from 'react'
import { Row, Modal, Form, Checkbox, Col } from 'antd';
import { connect } from 'react-redux'
import { axiosInstance } from '../store/utils'
import CheckboxGroup from 'antd/lib/checkbox/Group';


class FriendsModal extends React.Component {

  getcheckbox = () => {
    return (
      <Checkbox.Group style={{ width: '100%' }}>
        <Row>
          {this.props.users.map(element =>
            (<Col span={8}>
              <Checkbox value={element}>{element.username}</Checkbox>
            </Col>))}
        </Row>
      </Checkbox.Group>)
  }

  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        centered
        title="Select Friends For Message"
        okText="Add"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <Form.Item>
            {getFieldDecorator('checkbox-group',{
              initialValue: this.props.users.filter(user=>user.friend==true)
            }
            )(
              this.getcheckbox(),
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const FriendsModalForm = Form.create()(FriendsModal)

export default FriendsModalForm
