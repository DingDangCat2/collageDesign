import React from 'react';
import 'antd/dist/antd.css'; 
import "../static/css/index.css";
import Register from './register';
import Log from '../componrnts/Log';
import Ajax from '../ajax/ajax';
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

class Shoue extends React.Component{
  constructor(props){
    super(props)
  }
onFinish (values) {
  let that=this;
      console.log('Received values of form: ',values);//axios请求
      Ajax('/login',values,'post')
      .then(function (response) {
        if(response.data){
         message.success("login success!");
        that.props.history.replace('/');
        
        }else{
      message.error("your password or name does not having with user account!");
        }
      })
      .catch(function (error) {
        message.error('the sever has error!');
        that.props.history.go(0);
      });
    };
 Zhuce(){
     
      this.props.history.push('/Register');
    }
    forget(event){
      event.preventDefault();
      this.props.history.push('/forget');
    
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
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
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
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot"  onClick={this.forget.bind(this)}>
          忘记密码 ！
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or<button onClick={this.Zhuce.bind(this)}>zhuce</button>
      </Form.Item>
    </Form>

    </div>
    </div>
  );
      }
};
export default Shoue;