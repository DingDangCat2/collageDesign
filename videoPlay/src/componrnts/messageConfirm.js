import React, { useState } from 'react';
import { Modal, Button,Input ,Form,message,Spin} from 'antd';
import '../static/css/mesConfirm.css';
import axios from 'axios';
class MesConfirm  extends React.Component {
    constructor (props){
        super(props);
        this.state={
            'isModalVisible':false,
            'number':60,
            'statu':false,
            'message':'',
        }
    }
    change(){  
        this.setState({'number':--this.state.number})
    }

 componentDidMount(){
   
    this.time= setInterval(()=>{this.change()},1000);
 }

 componentWillUnmount(){
     clearInterval(this.time);
   
 }
show(){
    if(this.props.status){
        this.setState({
         'isModalVisible':true,
         'number':60,
         'statu':false,
        })
     }else{
      message.error('confirm your message');
      this.setState({'statu':false});
     }
}
   showModal () {
      this.setState({'statu':true});
     setTimeout(()=>{this.show();},2000)
  };

 handleOk  ()  {
     clearInterval(this.time);
    this.setState({
        'isModalVisible':false,
        'number':60
       })
  };

  handleCancel  ()  {
    clearInterval(this.time);
    this.setState({
        'isModalVisible':false,
        'number':60
       })
  };
 MessageConfirm(e){
        this.setState({'number':60})
   if(this.state.message){
       console.log(this.state.message);
   axios({url:'/register',
   method:'post',
   headers:{'Content-type':'application/json;charset=utf-8'},
   data:{'values':this.state.message},
   }).then((res)=>{
   // this.props.history.replace('/user');
if(res.status=200 || 201 ){
    message.success('register ok!')
   window.location.reload();
}else{
    message.error('error using later!');
}
   })
   }else{
       message.error('input your number again');
   }

}

changes(e){
    this.setState({'message':e.target.value});
}

render(){
  return (
    <>
      <Button type="primary" onClick={this.showModal.bind(this)} htmlType='submit' style={{'background':'white','color':'blue'}}>
      <Spin spinning={this.state.statu}/>confirm
      </Button>
      <Modal title="checking" visible={this.state.isModalVisible} onOk={this.handleOk.bind(this)}  onCancel={this.handleCancel.bind(this)} destroyOnClose={true}
      footer={null}>
          <div className="message">
      <form>  <Input name='input' placeholder="输入六位验证码" maxLength='6'  onChange={this.changes.bind(this)}></Input>
       <Button className='btnA'>{this.state.number}</Button>
      <Button className='btnB' type="button" onClick={this.MessageConfirm.bind(this)} >comfirm</Button>
      {/* 当这个按钮被点击的时候，默认也会触发用户注册信息的form的提交事件，所以会由三 个register请求 */}
      </form>

      </div>
      </Modal>
    </>
  );
}
};

export default MesConfirm;