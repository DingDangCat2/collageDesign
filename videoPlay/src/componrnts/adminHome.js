import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'; 
import allUser from './adminAppAllUer/allUser';
import Select from './shouyezujian/select';
import '../static/css//shouye.css';
import {BrowserRouter as Router,Route,Link,Redirect,withRouter} from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Head from './shouyezujian/header';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import Ajax from '../ajax/ajax';
import rules from './shouyezujian/rules';
import list from '../componrnts/zhuye/bofang/list';
import userList from './adminAppAllUer/userList';
import playVideo from '../componrnts/adminAppAllUer/adminBfVideo';
const { Header, Content, Footer, Sider } = Layout;
class adminHome extends React.Component {
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
    Ajax('/admin_home','','GET')
    .then((response)=>{
if(response.data=='yes'){

}else{
this.props.history.replace('/admin');
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
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <div className="logo"></div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to='/admin_home/admin_home'>全部用户</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          <Link to='/admin_home/admin_home2'>视频剪辑</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
        <Link to='/admin_home/admin_home3'>视频播放</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<UserOutlined />}>
        <Link to='/admin_home/admin_home4'>个人管理</Link>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Header className="site-layout-sub-header-background" style={{ padding: 0 }} >
        <Head/>{/*head中没有子节点，则该组件的props为一个空对象 */}
        </Header>
      <Content style={{ margin: '24px 16px 0' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
      
       <Redirect to='/admin_home/admin_home'></Redirect>
          <Route path='/admin_home/admin_home' component={allUser}></Route>
            <Route path='/admin_home/user/:id' exact component={userList}></Route>
            <Route path='/admin_home/user/bfvideos/:id' exact component={playVideo}></Route>
          <Route path='/admin_home/admin_home2' component={Select}></Route>
          <Route path='/admin_home/admin_home3' component={list}></Route>
          <Route path='/admin_home/list/:id' component={playVideo}></Route>
          <Route path='/admin_home/admin_home4' component={rules}></Route>

        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  </Layout>
      );
    }
  }
  export default adminHome;