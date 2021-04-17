import React from 'react';
import 'antd/dist/antd.css';
import Tabl from '../zhuye/个人管理/table';
export default class Rules extends React.Component{
    constructor(props){
        super(props) 
    }
componentDidMount(){

}
render(){
    return <div className='rules'>
<Tabl></Tabl>
    </div>
}
}