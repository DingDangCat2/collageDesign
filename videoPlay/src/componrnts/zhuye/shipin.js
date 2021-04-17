import React from 'react';
import 'antd/dist/antd.css'; 
import { Pagination } from 'antd';
import '../../static/css/shipin.css';
import Ajax from '../../ajax/ajax';
class Fanye extends React.Component {
    state = {
      current: 3,
    };
  
    onChange = page => {
      console.log(page);
      this.setState({
        current: page,
      });
    };
 /* componentDidMount(){
    Ajax('/shipin','','post')
    .then(function(response){
      console.log(response.data)
    })
    .catch(function(err){console.log('err')});
  }*/
    render() {
      return <div className='shipin'>
          <div className='xianshi'></div>
          <div className='fanye'> <Pagination current={this.state.current} onChange={this.onChange} total={50} /></div>
      </div>
    }
  }
  export default Fanye;