import React from 'react';
import 'antd/dist/antd.css'; 
import '../../static/css/massage.css';
class Massage extends React.Component{
    constructor(props){
        super(props)
        this.state={
            username:'xjf',
            tel:'18398989357',
            address:'bbb'
        }
    }
    componentDidMount(){
        //axios请求
    }

    render(){
        return<div className='massage'>
            <div className='massage1'>username:{this.state.username}<br></br>
                                      tel:{this.state.tel}<br></br>
                                        address:{this.state.address}<br></br>
                                        <button className='change'>修改个人信息</button>{/*区域宽度1606 可用高度215px */}
            </div>
            <div className='massage2'>
<img src='' alt='获取头像'></img>
            </div>
        </div>
    }
} 
export default Massage;