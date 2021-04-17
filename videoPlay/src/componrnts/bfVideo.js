import videoJs from 'video.js';
import React, { Component } from "react";
import 'video.js/dist/video-js.css';
import '../static/css/bfVideo.css';
import RemarkList from './remarkList';
window.videoJs=videoJs;
class bfVideo extends React.Component{
    constructor(props){ 
        super(props)
        const idss=(this.props.match.params.id).split('&');
        this.state={
            id:"s"+1,
            src: idss[0].slice(1),
            user:idss[1],
        }
        
    }
    componentDidMount(){
        try { 
            console.log(this.state.user);
            this.player=videoJs(this.state.id,{
              bigPlayButton: true,
              textTrackDisplay: false,
              posterImage: false,
              errorDisplay: false,
              controls: true,
              preload: "auto",
              sources: [
                  {
                      type: 'application/mpegURL',
                      src:'/'+this.state.src, //你的m3u8地址（必填）
                  }
              ],
          
          },function onPlayerReady(){
              this.play();
             
          });



          } catch (error) {
            console.log(error);
          }
    }

    componentWillUnmount(){
        this.setState({
            "id":this.state.id+1,
        })
        this.player.dispose();
    }
    render(){
    
        return(<div className='remark'>
                    <video id={this.state.id} className="video-js vjs-theme-city vii">
                     <source/> 
                    </video>
                    <div className='remarkPage'><RemarkList data={this.state}/></div>
                </div>
        )
    }
}

export default bfVideo;