import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'; 
import publish from './shouyezujian/home';
import Select from './shouyezujian/select';
import '../static/css//shouye.css';
import {BrowserRouter as Router,Route,Link,Redirect,withRouter} from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Head from './shouyezujian/header';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Ajax from '../ajax/ajax';
import rules from './shouyezujian/rules';
import list from '../componrnts/zhuye/bofang/list';
import bfVideo from './bfVideo';
import playvideo from './zhuye/bofang/playvideo';
const { Header, Content, Footer, Sider } = Layout;
class Shouye extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      theme: 'dark',
      current: '1',
    };

  }  
  
  
    changeTheme = value => {
      this.setState({
        theme: value ? 'dark' : 'light',
      });
    };
  
    handleClick = e => {
      
      this.setState({
        current: e.key,
      });
    };
  componentDidMount(){  
    Ajax('/home','','GET')
    .then((response)=>{
if(response.data=='yes'){

}else{
this.props.history.replace('/user');
}
    })
    .catch(function(error){
      alert(error);
  
    })
  }
    render() {
      return (
        <Layout className='layout'>
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
;
      }}
      onCollapse={(collapsed, type) => {

      }}
    >
      <div className="logo"></div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to='/home'>发布广场</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          <Link to='/home2'>视频上传</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
        <Link to='/home3'>上传列表</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<UserOutlined />}>
        <Link to='/home4'>个人管理</Link>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Header className="site-layout-sub-header-background" style={{ padding: 0 }} >
        <Head/>{/*head中没有子节点，则该组件的props为一个空对象 */}
        </Header>
      <Content style={{ margin: '24px 16px 0' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
       <Redirect to='/home'></Redirect>
          <Route path='/home' component={publish}></Route>
          <Route path='/bfVideo/:id' component={bfVideo}></Route>
          <Route path='/home2' component={Select}></Route>
          <Route path='/home3' component={list}></Route>
          <Route path='/list/:id' component={playvideo}></Route>
          <Route path='/home4' component={rules}></Route>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  </Layout>
      );
    }
  }
  export default Shouye;