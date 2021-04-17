import React from 'react';
import { Card, Avatar,List, message,Spin } from 'antd';
import { CloseOutlined, EllipsisOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; 
import Ajax from '../../ajax/ajax';
import {withRouter} from  'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import '../../static/css/adminAllUser.css';
const fakeDataUrl='/adminAllUser';
const location=window.location;
class allUser extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            hasMore:true,
            data:'',
            pageNumber:0,
        }
        
          

    }
    componentDidMount(){
      this.fetchData(res => {
        this.setState({
          data: res.data,//调用回调函数，拿到数据更改状态，触发页面重新渲染。
        });
      });


    }

    fetchData = callback => {
      Ajax(fakeDataUrl,{pageNumber:this.state.pageNumber},'post'
      ).then((res)=>{
          callback(res)
      }).catch(function(err){
        console.log(err);
      })
    };
  
    handleInfiniteOnLoad = () => {
      this.setState({
        loading:true,
      })
      let { data } = this.state;

      this.fetchData(res => {
        if(res.data.length<10){
          message.warning("the videos are all !");
          data = data.concat(res.data);
          this.setState({
            loading:false,
            hasMore:false,
            data,

          })
        }else{
        data = data.concat(res.data);//数组的拼接，会得到一个新的数组。
        this.setState({
          data,
          loading: false,
          hasMore:true,
          pageName:this.state.pageName+1,
        });
      }
      });

  }
  
  userDelete(item){
    console.log(item);
    if(window.confirm("are you sure?")==true){
      Ajax('/userDelete',item,'post').then((res)=>{
        if(res.status=200 &&res.data!=' ') {message.success('you delete it!');location.reload();}else{
 message.error('failed to do it!');} 
      } ).catch((err)=>{console.log(err);})
    }else{
      return false;
    }
  }


  userList(item){
   this.props.history.push('user/:'+encodeURI(item.id));
}

    render(){
        const { Meta } = Card;
        return(
            <InfiniteScroll initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}>
<List
    grid={{ gutter: 16, column: 5 }}
    dataSource={this.state.data}
    renderItem={item => (
      <List.Item>
         <Card hoverable
        style={{ width: 200,background:"skyblue" }}
        actions={[

            <CloseOutlined key="edit" onClick={this.userDelete.bind(this,item)}/>,
          <EllipsisOutlined key="ellipsis" onClick={this.userList.bind(this,item)}/>,
        ]}
      ><div className='userId'><span>id:{item.id}</span></div>
        <Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={item.name}
          description={item.tel}
        />
      </Card>
      </List.Item>
    )}
  >
       {this.state.loading && this.state.hasMore && ( 
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
  </List>
</InfiniteScroll>
        )
}
}
export default withRouter(allUser);
