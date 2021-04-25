import React ,{useState}from 'react';
import Ajax from '../ajax/ajax';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; 
import '../static/css/register.css';
import {withRouter} from 'react-router-dom';
import MesConfirm from './messageConfirm';
import axios from 'axios';
import {
    Form,
    Input,
    Tooltip,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,message,
  } from 'antd';
  import { QuestionCircleOutlined } from '@ant-design/icons';
  
  const { Option } = Select;

 
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  class Register extends React.Component{
   constructor(props){
     super(props);
     this.state={
       'status':false
     }
   }
    onFinish = values => {
      console.log('Received values of form: ', values);
      if(values){
        this.setState({'status':true});
      axios({
        url:'/register',
        method:'post',
        data:values,
        headers:{
          'Content-Type':'application/json;charset=utf-8',
  
        }
      }).then(function(res){
        if(res.status==205){
        message.error('error');
        }else{
          if(res.status=200 || 201){
            message.success('ok!');
          }
        }

      })
    }
    };
  
    prefixSelector = (
      <Form.Item name="prefix" noStyle>
        <Select
          style={{
            width: 70,
          }}
        >
          <Option value="86">+86</Option>
          <Option value="87">+87</Option>
        </Select>
      </Form.Item>  
    );
  render(){

  
    return (
        <div className="register">
      <Form
        {...formItemLayout}
     
        name="register"
        onFinish={this.onFinish.bind(this)}
        scrollToFirstError
      >
 <Form.Item
        name="username"
        label="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input placeholder="Username" />
      </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
  
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
  
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
  
        
  
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
          ]}
        >
          <Input
            addonBefore={this.prefixSelector}
            style={{
              width: '100%',
            }}
          />
        </Form.Item>
  
        
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject('Should accept agreement'),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="/html/readme.html" >agreement</a>
          </Checkbox>   
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
      
            <MesConfirm status={this.state.status}></MesConfirm>
        
        </Form.Item>
      </Form>
      </div>
    );
  };
}

export default withRouter(Register);