import React from 'react';
import 'antd/dist/antd.css'; 
import '../../static/css/cut.css';
import { Upload, Button } from 'antd';
import { HourglassTwoTone } from '@ant-design/icons';
class Cut extends React.Component {
    state = {
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'http://www.baidu.com/xxx.png',
        },
      ],
    };
  
    handleChange = info => {
      let fileList = [...info.fileList];
  
      // 1. Limit the number of uploaded files
      // Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-2);
  
      // 2. Read from response and show file link
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.path;
        }//文件的上传会显示多个response，初步估计上传的文件被分成了若干段，每一段上传成功，都会返回响应。
        return file;  
      });
  
      this.setState({ fileList });
    };
  
    render() {
      const props = {
        accept:".mp4",
        action: '/hkj',
        onChange: this.handleChange,
        multiple: true,
      };
      return (
      <div className='cut'>
        <Upload {...props} fileList={this.state.fileList} name='sd'>{/*{this.state.fileList[this.state.fileList.length-1].name*/}
          <Button icon={<HourglassTwoTone />}>视频切片</Button>
        </Upload>
        </div>
      );
    }
  }
  export default Cut;