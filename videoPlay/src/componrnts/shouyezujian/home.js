import React from 'react';
import { Card, Avatar,List, message,Spin,Drawer,Button,Input} from 'antd';
import {PlayCircleTwoTone, EditTwoTone} from '@ant-design/icons';
import 'antd/dist/antd.css'; 
import Ajax from '../../ajax/ajax';
import {withRouter} from  'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import '../../static/css/home.css';

const fakeDataUrl='/userLike';

class publish extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading:false,
            hasMore:true,
            data:'',
            pageNumber:0,
            visible:false,
        }
        
          

    }

    
   showDrawer = () => {
  this.setState({visible:true})
  };

  onClose = () => {
    this.setState({visible:false})
};
  
    componentDidMount(){
      this.fetchData(res => {
          console.log(res.data);
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
  
reMark(item){
 this.showDrawer();
  }

remarkButton(e){
  e.preventDefault();
let arr={ "id":e.target.input.id,
"pages":e.target.input.getAttribute('data-video'),
"remark":e.target.input.value};
if(e.target.input.value!=''){
Ajax('/remarkState',arr,'post').then((res)=>{
 if(res.data!=' '&&res.status==200){
   message.success('remark it with ok!');
 }else{
   message.error('failed remark ! --later');
 }
})
}else{
  message.error("please inputing the number of word more than 0 !");
}
arr=null;
}

bfVideo(item){
  this.props.history.push('bfVideo/:'+encodeURI(item.video)+"&"+encodeURIComponent(item.id));
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
    grid={{ gutter: 10, column: 5 }}
    dataSource={this.state.data}
    renderItem={item => (
      <List.Item>
         <Card hoverable="true" className="like"
         size="small"
      cover={<img alt="example" src={item.img} style={{width:180,height:150,boxShadow:7 }} />}
  style={{height : 150 ,width:180}}
        actions={[
            <PlayCircleTwoTone key="edit" twoToneColor="#eb2f96" onClick={this.bfVideo.bind(this,item)} />,   
          <EditTwoTone key="ellipsis" twoToneColor="#52c41a" onClick={this.reMark.bind(this,item)}/>,
        ]}
      >
        <Meta style={{height:10}}
         avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
         description={item.name}
        />
         <Drawer
          title="remark your idea!"
          placement="top"
          closable={false}
          onClose={this.onClose.bind(this)}
          visible={this.state.visible}
        >
            <form onSubmit={this.remarkButton.bind(this)}>
      
<Input allowClear  id={item.id} name="input" size="large" style={{height:100}} data-video={item.video} data-name={item.name} ></Input>
          <Button type="submit" name="submit" htmlType="submit" onClick={this.onClose} style={{marginTop:12}}>
          Submit
        </Button>
  
    </form>
        </Drawer>
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
export default withRouter(publish);
