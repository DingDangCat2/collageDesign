import React from 'react';
import 'antd/dist/antd.css'; 
import '../../static/css/lists.css';
import { List, message, Avatar, Spin } from 'antd';
import {CaretRightOutlined} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import VideoPlayer from './adminBfVideo';
import Ajax from '../../ajax/ajax';
import {CloseOutlined} from '@ant-design/icons'
const fakeDataUrl = '/shipinS';

export default class Lists extends React.Component {

constructor(props){

  super(props)

  this.state = {
    pageName:0,
    data: [],
    loading: false,
    hasMore: true,
    status:false,
    src:{},
  };
}
  

    componentDidMount() {
      

      this.fetchData(res => {
        console.log(res.data);
        this.setState({
          data: res.data,//调用回调函数，拿到数据更改状态，触发页面重新渲染。
        });
      });

    }
  
    fetchData = callback => {
      const id=this.props.match.params.id;
      Ajax(fakeDataUrl,{pageName:this.state.pageName,userId:id.slice(1)},'post'
      ).then((res)=>{
          callback(res)
      }).catch(function(err){
        console.log(err);
      })
    };
  
    handleInfiniteOnLoad = () => {
      let { data } = this.state;
      this.setState({
        loading:true,
      })
      this.fetchData(res => {
        if(res.data.length<5){
          message.warning("the videos are all !");
          console.log(res.data)
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
 click=(arg)=>{
      this.setState({
     status:true,
        });
        this.props.history.push('bfvideos/:'+arg.video);
 }

    render() {
      return (
        <div className="demo-infinite-container">
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}
          >
            <List
              dataSource={this.state.data}
              renderItem={item => (
                <List.Item key={item.id} actions={    [ <div>
                  <button className='bofang' key={item.id} onClick={this.click.bind(this,item)}><CaretRightOutlined />播放</button>
                  
                </div>]                
                 }>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={item.img}/>
                    }
                    title={<p>{item.name}</p>}
                    description={item.time}
                  />
                   
                 
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
        
        </div>
      );
    }
  };
