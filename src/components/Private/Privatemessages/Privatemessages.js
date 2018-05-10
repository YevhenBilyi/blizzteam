import React, { Component } from 'react';
import io from 'socket.io-client';
import './Privatemessages.css';
import {connect} from 'react-redux';
import axios from 'axios';
import Emoji from 'react-emoji-render';
import MyEmojiInput2 from './MyEmojiInput2/MyEmojiInput2';
import {emojify} from 'react-emojione';
import ContentEditable from 'react-contenteditable';

class Privatemessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '<img src="https://d30y9cdsu7xlg0.cloudfront.net/png/114472-200.png" alt="fire" height="20px" width="20px"/>',
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
    this.addEmoji=this.addEmoji.bind(this)

  }
  componentDidMount() {

    //getting messages that will show when you just came to page
    axios.get(`/api/messages/${this.state.room}`).then(res=>{
      this.setState({
    messages: res.data})
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

    //refreshing list of message from db
  axios.get(`/api/messages/${this.state.room}`).then(res=>{
      this.setState({
    messages: res.data,
    input:''})
  })

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
      message: this.state.input,
      room: this.state.room
    }) 
 })     
}
openWindow(){

  this.state.emoji?this.setState({emoji:false}):this.setState({emoji:true})
}
addEmoji(e){
  var input=`<p>${this.state.input} <Emoji text= {':'+${e}+':'}/>}</p>`

  console.log("INPUT",input)
this.setState({input})

}



  render() {
    //creating message list by mapping thru messages
    let messages=this.state.messages.map((message,i)=>{
      return (<div key={i}><img src={message.profile_picture} alt=""/> <p> {message.message_time} {message.battle_tag} {message.mmr}:
      <Emoji text= {message.message}/></p>
      <button onClick={()=>{
        let action="like"
        let number=message.like+1;
        let{user_id, message_time}=message;
        let channel_id=this.props.id
        axios.put('/api/like',{action,number,user_id,message_time,channel_id} ).then(res=>{

          this.socket.emit('message sent', {
            message: this.state.input,
            room: this.state.room
          }) 
        })
      }}><img src="https://d30y9cdsu7xlg0.cloudfront.net/png/114472-200.png" alt="fire" height="20px" width="20px"/>
      </button>{message.like}<button onClick={()=>{
        let action="dislike"
        let number=message.dislike+1;
        let{user_id, message_time}=message;
        let channel_id=this.props.id
        axios.put('/api/like',{action,number,user_id,message_time,channel_id} ).then(res=>{

          this.socket.emit('message sent', {
            message: this.state.input,
            room: this.state.room
          })
        })
      }}><img src="https://cdn0.iconfinder.com/data/icons/thin-voting-awards/24/thin-0664_dislike_thumb_down_vote-512.png" alt="fire" height="20px" width="20px"/>
      </button>{message.dislike}</div>)
    })

    

    return (
      <div className="App">
     <h1>My Room: {this.state.room}</h1> 
       
        {
            <div>
                <h2> {messages}</h2>
                {/* writing new message */}
              {/* <input value={this.state.input} onChange={e => {
                this.setState({
                  input: e.target.value
                })
              }} /> */}
              <ContentEditable
              html={this.state.input} // innerHTML of the editable div
              disabled={false}       // use true to disable edition
              onChange={e=>{this.setState({input:e.target.value})}} // handle innerHTML change
            />
              <button onClick={this.openWindow}>emoji</button>
                
                {/* Checking if somebody press emoji button and open menu */}
              {this.state.emoji?
                <MyEmojiInput2 addEmoji={this.addEmoji}/>:
                <p></p>
              }
              
              <button onClick={this.sendMessage}>Send</button>
           
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
