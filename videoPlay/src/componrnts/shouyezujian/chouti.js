import React, { useState } from 'react';
import { Drawer, Button,Avatar } from 'antd';
import AvatarLoader from './avatarLoad';
import { message,Input, Space,Form } from 'antd';

import {withRouter} from  'react-router-dom';
import '../../static/css/chouti.css';
import Ajax from '../../ajax/ajax';

class Chouti extends React.Component {
 
  state = { visible: false, childrenDrawer: false,values:'asd',avatarLoad:'/avatarDisplay',num:0,"power":false};

  showDrawer = () => {
    this.setState({
      visible: true,
    });
    
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true,
    });
  };

  onChildrenDrawerClose = () => {
    this.setState({
      childrenDrawer: false,
    });
  }; 
  
  Finish(values){
    console.log(values);
 Ajax('/password',values,'POST').then((res)=>{
if(res!=''){
  console.log(res.data);
  message.success('this is success！');
  this.setState({
    visible: false,
    childrenDrawer: false,
  });
  this.props.history.replace('/user');

}else{
  message.error('this is bad!');
}
 })
 .catch(function(err){
   console.log(err);
 })
 };

update(item){
  this.setState({
    avatarLoad:item,
    num:this.state.num+1
  })
  this.props.pro2(this.state.num);
  console.log(this.state.avatarLoad);
}

componentDidMount(){
  Ajax('/power',{},'post').then(res=>{
if(res.status==200 &&res.data!=' '){this.setState({"power":true})}else{this.setState({"power":false})}
  })
}

//当页面完成渲染或者刷新的时候，调用父组件的函数。传入参数改变父组件的状态。再将状态隐射到头像组件的属性，头像组件根据传入的值，设置头像的请求地址。
  render() {
  
    return (
      <>

        <Button type="primary" onClick={this.showDrawer} className='button1'>
          欢迎您 : {this.props.pro.name}
        </Button>
        <Drawer
          title="个人信息"
          width={400}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
       <Avatar size={60} src={this.state.avatarLoad} alt='touxiang' className='img1'/>
       <AvatarLoader src={this.update.bind(this)}></AvatarLoader>
            <table className='manage'>
    <tr><td className='td'>编号：</td><td className='td'>{this.props.pro.state}</td></tr>
    <tr><td className='td'>用户名：</td><td className='td'>{this.props.pro.name}</td></tr>
              <tr><td className='td'>权限:</td><td className='td'>{this.state.power ? '管理员账号':'普通用户账号'}</td></tr>
              <tr><td className='td'><button onClick={this.showChildrenDrawer.bind(this)}>修改密码</button></td></tr>
              
            </table>

          <Drawer
            title="Two-level Drawer"
            width={320}
            closable={false}
            onClose={this.onChildrenDrawerClose}
            visible={this.state.childrenDrawer}
          >
              <Space direction="vertical"></Space>
              <Form  name="register" onFinish={this.Finish.bind(this)}>
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
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
     
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
      </Form>
          </Drawer>
        </Drawer>
      </>
    );
  }
}
export default withRouter(Chouti);