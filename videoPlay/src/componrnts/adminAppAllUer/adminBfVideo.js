import videoJs from 'video.js';
import React, { Component } from "react";
import 'video.js/dist/video-js.css';

window.videoJs=videoJs;
class playvideo extends React.Component{
    constructor(props){ 
        super(props)
        const idss=this.props.match.params.id;
        this.state={
            id:"s"+1,
            src: idss.slice(1),
        }
        
    }
    componentDidMount(){
        console.log(this.props.match.params.id);
        try { 
            
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
                </div>
        )
    }
}

export default playvideo;