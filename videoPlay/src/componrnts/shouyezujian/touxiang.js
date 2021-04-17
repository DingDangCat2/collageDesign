import React from 'react';
import 'antd/dist/antd.css'; 
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../../static/css/touxiang.css';
class Touxiang extends React.Component{
    constructor(props){
        super(props)
        this.state={
            src:'/avatarDisplay'
        }
    }

    static getDerivedStateFromProps(props,state){//父组件中状态的改变会引起函数的调用！
        if(props.pro3!=' '){
        return {
     src:'/avatarDisplay?num='+props.pro3,
        }}else{
            return null;
                }
 
    }
    render(){
        return(
       <div className='touxiang'>
        <Avatar size="large" src={this.state.src}/>
        </div>
        )
    }
        
}
export default Touxiang;