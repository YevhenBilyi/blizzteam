import React, { Component } from 'react';
import io from 'socket.io-client';
import './Privatemessages.css';
import {connect} from 'react-redux';
import axios from 'axios';
import MyEmojiInput2 from './MyEmojiInput2/MyEmojiInput2';
import ContentEditable from 'react-contenteditable';
import thumbup from '../../../img/thumbup.png';
import thumbdown from '../../../img/thumb_down.png';
import smile from '../../../img/smile.png';

class Privatemessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      messages:[],
      room: this.props.id,
      filterString:'',
      filteredMessages:[],
      emoji:false
    }

    this.updateMessage = this.updateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.componentDidMount=this.componentDidMount.bind(this);
    this.openWindow=this.openWindow.bind(this);
    this.addEmoji=this.addEmoji.bind(this);
    this.scrollToBottom=this.scrollToBottom.bind(this);

  }
  componentDidMount() {

    //getting messages that will show when you just came to page
    axios.get(`/api/messages/${this.state.room}`).then(res=>{
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
    this.scrollToBottom()
  }
  sendMessage() {

    //getting the time
    var today = new Date();
    var message_time = ((today.getHours() < 10)?"0":"") +today.getHours()+ ":" + ((today.getMinutes() < 10)?"0":"")+today.getMinutes() + ":" + ((today.getSeconds() < 10)?"0":"")+today.getSeconds();

    let channel_id=this.state.room
    let message=this.state.input

    // posting message to my db
    axios.post('/api/message', {message,message_time,channel_id}).then(res=>{
         this.socket.emit('message sent', {
      message: res.data,
      room: this.state.room
    }) 
 })     
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
  console.log("el", this.el)
  if(this.el!==null)this.el.scrollIntoView({ behavior: "smooth" });
  
}



  render() {
    //creating message list by mapping thru messages
    var style2={  height:"100%",wordWrap:"break-word",padding:"3px"}
    let messages=this.state.messages.map((message,i)=>{
      return (<div className='wholewhole'  key={i}><div className="wholemessage" id='wholeprivate' >
      <div className="mainmain"><img src={message.profile_picture} alt=""/></div>
      <div className="insidemessage"><div className="userinfo">  {message.battle_tag} {message.mmr==0?<p>

      </p>:<p>{message.mmr}</p>} {message.message_time}
      </div>
      <div className="contentSuka contentsukaprivate">
       <ContentEditable style={style2}
              html={message.message} 
              disabled={true}/></div>{/*LIKE BUTTON*/}<div className="like imgbutton">
      <button onClick={()=>{
        let action="like"
        let number=message.like+1;
        let{user_id, message_time}=message;
        let channel_id=this.props.id
        axios.put('/api/like',{action,number,user_id,message_time,channel_id} ).then(res=>{

          this.socket.emit('message sent', {
            message: res.data,
            room: this.state.room
          }) 
        })
      }}><img src={thumbup} alt="thumbup" height="20px" width="20px"/>
      </button>{message.like}<button onClick={()=>{
        let action="dislike"
        let number=message.dislike+1;
        let{user_id, message_time}=message;
        let channel_id=this.props.id
        axios.put('/api/like',{action,number,user_id,message_time,channel_id} ).then(res=>{

          this.socket.emit('message sent', {
            message: res.data,
            room: this.state.room
          })
        })
      }}><img src={thumbdown} alt="thumbdown" height="20px" width="20px"/>
      </button>{message.dislike}</div></div></div></div>)
    })

    

    return (
      <div className="privatemessages">
     <h1>Room {this.state.room}</h1> 
       
        {
            <div>
              <div className='wholeprivatemessage'>
                 {messages}
                 <div ref={(el) => { this.el = el; }}></div>
                 </div>
                {/* writing new message */}
                <div className="inputline">
                <div className="contenteditable" id='contenteditable'>
              <ContentEditable
              html={this.state.input} // innerHTML of the editable div
              disabled={false}       // use true to disable edition
              onChange={this.handleChange=(e)=>{this.setState({input:e.target.value})}} // handle innerHTML change
            />
              </div>
              <div className="imgbutton">
              <button onClick={this.openWindow}><img src={smile} alt="smile"height="20px" width="20px" /></button>
              </div>
                {/* Checking if somebody press emoji button and open menu */}
                <div className="sendbutton" id='buttonsend'>
             <button onClick={this.sendMessage}>SEND</button>
             </div>
              {this.state.emoji?
                <div id='emojipicker2'><MyEmojiInput2 addEmoji={this.addEmoji}/></div>:
                <p></p>
              }
              
              
           
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
export default connect(mapStateToProps)(Privatemessages) ;
