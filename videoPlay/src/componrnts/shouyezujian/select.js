import React from 'react';
import 'antd/dist/antd.css';
import '../../static/css/select.css';
import Cut from './qiepian';
export default class Select extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return <div className="select">
            <div className='date1'><Cut/></div>
    <div className='date2'>{/*显示切片视频 */}opijop</div>
        </div>
    }
}