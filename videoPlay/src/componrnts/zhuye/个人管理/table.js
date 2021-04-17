import React from 'react';
import 'antd/dist/antd.css';
import { message,Table, Tag, Space,Spin,Alert } from 'antd';
import Ajax from '../../../ajax/ajax';
import Axios from 'axios';
const { Column, ColumnGroup } = Table;

export default class Tabl extends React.Component{
    constructor(props){
        super(props)
this.state={
  arr:"",
  load:false,
}
    }
    componentDidMount(){

Ajax('/table','','post')
.then((response)=>{
this.setState({arr:response.data,play:false});

}

)
.catch(function(error){
  console.log(error);
})
    }
  


    delete(arg){
      if (window.confirm("你确定？")==true){ 
       Ajax('/delete',arg,'GET').then((res)=>{
        if(res){

                   message.success('this is good');
        }else{
          message.error('This is bad')
        }
      })
      }else{ 
       return false; 
      } ;

    }

download(arg){
  this.setState({load:true});
  var that=this;
 Axios({
   method:'get',
    url:'/download',
    params:arg,
    responseType:'blob',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },

 }).then(function(res){ 
   const blob=new Blob([res.data],{type:'application/zip;charset=utf-8'});
   if ('download' in document.createElement('a')) { 
    const eLink = document.createElement('a');
      // 指向上面的iframe框架（防止跳转至空白页）,可有可无
    eLink.download = "videos"+(Math.random()*10+1)+".zip";
    eLink.href = URL.createObjectURL(blob);
    eLink.click();
    URL.revokeObjectURL(eLink.href);// 释放URL 对象
    that.setState({
      load:false,
    });
    message.success('load success!');
   
  }//zip文件的下载实质是通过a链接，指定url。通过url传会数据，并将数据转换为blob对象。
 }).catch(function(err){
   alert('下载错误，稍后重试！');
 
 })

}

upload(record){
console.log(record);
Ajax('/publish',record,'post').then(res=>{
  if(res.data!=' '&& res.status==200){
    message.success("remark success!");
  }else{
    message.error("remark failed");
  }
}).catch((error)=>{
  console.log(error);
});
}

 render(){

     return  <Table dataSource={this.state.arr}>
     <Column title="key" dataIndex="key" key="key"/>
     <Column title="pages" dataIndex="pages" key="pages" />
     <Column title="time" dataIndex="time" key="time" />
     <Column
       title="type"
       dataIndex="type"
       key="type"
       render={type => (
         <>
           {type.map(ta=> (
             <Tag color="blue" key={ta}>
               {ta}
             </Tag>
           ))}
         </>
       )}
     />
     <Column
       title="Action"
       key="action"
       render={(text, record,index) => (
         <Space size="middle">
           <button onClick={this.download.bind(this,record)}>
              <Spin spinning={this.state.load}>
              <Alert
            message="下载"
            type="info"
          />
        </Spin>
      </button>
           <button onClick={this.delete.bind(this,record)}
           key={this.state.status}><Spin spinning=''>
           <Alert
         message="删除"
       />
     </Spin></button>

     <button onClick={this.upload.bind(this,record)}
           ><Spin spinning=''>
           <Alert
         message="发布"
       />
     </Spin></button>
         </Space>
       )}
     />
   </Table>

 }
}