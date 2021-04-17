import React from 'react';
import 'antd/dist/antd.css'; 
import '../../static/css/head.css';
import Touxiang from './touxiang';
import Ajax from '../../ajax/ajax';
import {withRouter} from  'react-router-dom';
import Chouti from '../shouyezujian/chouti';

class Head extends React.Component{
    constructor(props){
        super(props)
        this.state={
            state:'0',
            name:'null',
            num:0,
        }
        this.Out=this.Out.bind(this);

    };
Out(){
        Ajax('/out','','GET')
        .then((response)=>{
            if(response.data){
       this.props.history.replace('/admin');//:此处history只在 组件通过路由加载进来时才会存在
           alert("退出!");
            }
        })
        .catch(function(err){
           alert(err); 
        })
    };
    componentDidMount(){
     /*   Ajax('/header','','GET')
        .then((err,response)=>
           this.setState({
                user:response.data.user,
                state:response.data.ids   
                             
            })
            console.log(response.data)
        )
        */
       Ajax('/header','','GET')
       .then((response)=> {
         if(response.data){
            this.setState({
                name:response.data.user,
                state:response.data.ids                 
            })
         }else{
            this.setState({
                name:'null',
                state:'null'                 
            })
         }
        }
       )
       .catch(function (error) {
         alert("获取错误"); 

       });
     }


     update(item){
this.setState({
num:this.state.num+item,
})
     }
    render(){
        return(
            <div className='head'>
 
                <button className='tuichu' onClick={this.Out}>退出</button>
                 <div className='button'><Chouti pro2={this.update.bind(this)} pro={this.state} scoped/></div>
                <Touxiang pro3={this.state.num}></Touxiang>
               
            </div>
        )
    }
}
export default withRouter(Head);