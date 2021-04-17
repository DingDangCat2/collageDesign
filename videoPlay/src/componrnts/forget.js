import 'antd/dist/antd.css'; 
import '../static/css/forget.css';
import React from 'react';
import Axios from 'axios';


class Forget extends React.Component{
constructor(props){
    super(props)
    this.state={
        number:''
    }
};
blur(event){
    this.setState({number:event.target.value})

};
send(){
    const tel=this.state.number;  
};
yanzheng(){

}
render(){
    return <div className='forget'>
        <h1>找 回 密 码</h1>
       <label for='forget'>telephone:</label> <input type="tel" placeholder=" telephone" id='forget' onBlur={this.blur.bind(this)}/><button className='btn1' onClick={this.send.bind(this)}>发送</button>
       <br></br>
       <label for='forget'>验证码:</label> <input type="text" placeholder="" id='forget2'/>
       <button className='btn1' onClick={this.yanzheng.bind(this)}>提交</button>
    </div>
}
}
export default Forget;