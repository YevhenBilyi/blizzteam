import React, { Component } from 'react';
import io from 'socket.io-client';
import './Tiermessages.css';
import {connect} from 'react-redux';
import axios from 'axios';
import MyEmojiInput from './Emojilist/MyEmojiInput';
import ContentEditable from 'react-contenteditable';
import thumbup from '../../../img/thumbup.png';
import thumbdown from '../../../img/thumb_down.png';
import smile from '../../../img/smile.png';


class Tiermessages extends Component {
  constructor(props) {
    super(props);
    // assigning channel_id number based on url to not take it from user.server_num
    let channel_id=0;
    if(this.props.id==='Bronze')channel_id=1;
    else if(this.props.id==='Silver')channel_id=2;
    else if(this.props.id==='Gold')channel_id=3;
    else if(this.props.id==='Platinum')channel_id=4;
    else if(this.props.id==='Diamond')channel_id=5 ;
    else channel_id=6;
    this.state = {
      input: ``,
      messages:[],
      room: this.props.id,
      filterString:'',
      channel_id,
      filteredMessages:[],
      emoji:false
    }

    this.updateMessage = this.updateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.componentDidMount=this.componentDidMount.bind(this);
    this.filterArray=this.filterArray.bind(this);
    this.openWindow=this.openWindow.bind(this);
    this.addEmoji=this.addEmoji.bind(this);
    this.scrollToBottom=this.scrollToBottom.bind(this);

  }
  componentDidMount() {

    //getting messages that will show when you just came to page
    axios.get(`/api/messages/${this.state.channel_id}`).then(res=>{
      this.setState({
    messages: res.data})
    setTimeout(this.scrollToBottom, 1000)
  })
// socket stuff
    this.socket = io();
    this.socket.on(`${this.state.room} dispatched`, data => {
      console.log(data)
      this.updateMessage(data);
    })
    this.socket.on('room joined', data => {
      this.joinSuccess()
    })
    
  }
  updateMessage(message) {
      this.setState({
    messages: message,
    input:''})
    setTimeout(this.scrollToBottom, 1000)


  

  }
  sendMessage() {

    //getting the time
    var today = new Date();
    var message_time = ((today.getHours() < 10)?"0":"") +today.getHours()+ ":" + ((today.getMinutes() < 10)?"0":"")+today.getMinutes() + ":" + ((today.getSeconds() < 10)?"0":"")+today.getSeconds();
    let channel_id=this.state.channel_id
    let message=this.state.input
    // posting message to my db
    axios.post('/api/message', {message,message_time,channel_id}).then(res=>{
         this.socket.emit('message sent', {
      message: res.data,
      room: this.state.room
    }) 
 })     
}
filterArray(){
  var style2={  height:"100%",wordWrap:"break-word",padding:"3px"}
  if(this.state.filterString==='') alert("Please input beginning of battletag")
  else{
      let filterString=this.state.filterString;
  let filteredMessages=this.state.messages.filter(message=>message.battle_tag.split('').slice(0,filterString.split('').length).join('')===filterString).map((message,i)=>{
    return (<div><div className="wholemessage"  key={i}><div className="mainmain"><img src={message.hero} alt=""/></div> <div className="insidemessage">
     <div className="userinfo"> {message.mmr===0?'':message.mmr}  {message.battle_tag} {message.message_time} </div> <div className="contentSuka">    <ContentEditable style={style2}
    html={message.message} 
    disabled={true}/></div></div></div></div>)
  })
  this.setState({filteredMessages,
    filterString:''
  })
  }

}
openWindow(){

  this.state.emoji?this.setState({emoji:false}):this.setState({emoji:true})
}
addEmoji(emo){
  var input=this.state.input.split('<span>').join('').split('</span>').join('')
  input=`<span>${input}<img src=${emo} class="emoji" data-codepoints="1f605" height="20px" width="20px" /></span>`;
   
   
   this.setState({input})

}
scrollToBottom() {
  if(this.el!==null)this.el.scrollIntoView({ behavior: "smooth" });
  
}

  render() {
    var style2={  height:"100%",wordWrap:"break-word",padding:"3px"}
    //creating message list by mapping thru messages
    let messages=this.state.messages.map((message,i)=>{
    return (<div className="wholewhole"key={i}><div className="wholemessage"  ><div className="mainmain"><img src={message.hero} alt=""/></div> <div className="insidemessage">
    <div className="userinfo"> {message.mmr===0?'':message.mmr}  {message.battle_tag} {message.message_time} </div>
    <div className="contentSuka"><ContentEditable style={style2}
    html={message.message} 
    disabled={true}/></div>{/*LIKE BUTTON*/}<div className="like imgbutton"><button onClick={()=>{
        let action="like"
        let number=message.like+1;
        let{user_id, message_time}=message;
        let channel_id=this.state.channel_id
        axios.put('/api/like',{action,number,user_id,message_time,channel_id} ).then(res=>{

          this.socket.emit('message sent', {
            message: res.data,
            room: this.state.room
          }) 
        })
      
      }}><img src={thumbup} alt="thumbup" height="20px" width="20px"/>
      </button>{message.like} {/*DISLIKE BUTTON*/}<button onClick={()=>{
        let action="dislike"
        let number=message.dislike+1;
        let{user_id, message_time}=message;
        let channel_id=this.state.channel_id
        axios.put('/api/like',{action,number,user_id,message_time,channel_id} ).then(res=>{

          this.socket.emit('message sent', {
            message: res.data,
            room: this.state.room
          })
        })
      }}><img src={thumbdown} alt="thumbdown" height="20px" width="20px"/>
      </button>{message.dislike}</div></div></div></div>)
    })

    
var style={ wordWrap:"break-word"}
    return (
      <div className="Tiermessages">
      
        {
            <div >
              
            <div id="tierchat">
                  {this.state.filteredMessages.length>0?
                  this.state.filteredMessages:
                  messages
                  }
                  <div ref={(el) => { this.el = el; }}></div>
              </div>
            
                {/* writing new message */}
                <div className="inputline" >
                <div className="contenteditable">
                <ContentEditable 
              html={this.state.input} // innerHTML of the editable div
              disabled={false}       // use true to disable edition
              onChange={this.handleChange=(e)=>{this.setState({input:e.target.value})}} // handle innerHTML change
              />
              </div>

                  <div className="imgbutton">
                <button onClick={this.openWindow}><img src={smile} alt="smile"height="20px" width="20px" /></button>
                </div>
                <div className="sendbutton">
                <button onClick={this.sendMessage}>Send</button></div>
                </div>
                {/* Checking if somebody press emoji button and open menu */}
                
                {this.state.emoji?
                <div id='emojipicker'><MyEmojiInput addEmoji={this.addEmoji}/></div>:
                <p></p>
              }
              
                
              
              
              {/*writing filter name string*/}
              <div className="inputline inputline2">
              
              <input placeholder="Search by battletag" value={this.state.filterString} onChange={e=>{
                this.setState({filterString:e.target.value })}} />
                <div id="filterbutton">
              <button onClick={this.filterArray}> SEARCH</button>
              </div>
              {/* deleting filtered array */}
              <div id="resetbutton">
              <button onClick={()=>{
                this.setState({filteredMessages:[]})
              }}> RESET</button>
              </div>
              </div>
             
            </div>
      
        }
      </div>
    );
  }
}

function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(Tiermessages) ;
