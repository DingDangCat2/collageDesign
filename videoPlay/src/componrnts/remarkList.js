import { List, Avatar } from 'antd';
import React, { Component } from "react";
import Ajax from '../ajax/ajax';
class RemarkList extends React.Component{
    constructor(props){
        super(props)
        this.state={
            data:[]
        }
    }

    componentDidMount(){
        Ajax('/remarkList',{"id":this.props.data.user,"video":this.props.data.src},'post').then((res)=>{
            console.log(res.data);
            this.setState({
                data:res.data
            })
        })
    }
  render(){
      return   <List
      itemLayout="horizontal"
      dataSource={this.state.data}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={<p>{item.remarkName}</p>}
            description={item.remarkState}
          />
        </List.Item>
      )}
    />
  }
}

export default RemarkList;

