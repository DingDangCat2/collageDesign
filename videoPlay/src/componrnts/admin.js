import React from 'react';

import 'antd/dist/antd.css'; 
import "../static/css/index.css";
import Ajax from '../ajax/ajax';
import Register from './register'
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Log from '../componrnts/Log';

class Admin extends React.Component{
  constructor(props){
    super(props)
  }
onFinish (values) {
    let that=this;
        console.log('Received values of form: ',values);//axios请求
        Ajax('/admin_login',values,'post')
        .then(function (response) {
          if(response.data){
            message.success("login success with admin`s account !");
          that.props.history.push('/admin_home');
          
          }else{
            message.error("your name or password may be not having with admin account !" );
          }
        })
         .catch(function (error) {
           alert("请求错误！");
           that.props.history.go(0);
         });
    };
 Zhuce(){

      this.props.history.push('/register');
    }
  render(){
  return (<div>
    <Log></Log>
  <div className="shouye">
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={this.onFinish.bind(this)}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Adminname" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="AdminPassword"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="/register">
          忘记密码 ！
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        
      </Form.Item>
    </Form>

    </div>
    </div>
  );
      }
};

export default Admin;