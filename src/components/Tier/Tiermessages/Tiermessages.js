import React, { Component } from 'react';
import io from 'socket.io-client';
import './Tiermessages.css';
import {connect} from 'react-redux';
import axios from 'axios';
import Emoji from 'react-emoji-render';
import MyEmojiInput from './Emojilist/MyEmojiInput';
import {emojify} from 'react-emojione';

class Tiermessages extends Component {
  constructor(props) {
    super(props);
    // assigning channel_id number based on url to not take it from user.server_num
    let channel_id=0;
    if(this.props.id=='Bronze') channel_id=1
    else if(this.props.id=='Silver') channel_id=2
    else if(this.props.id=='Gold') channel_id=3
    else if(this.props.id=='Platinum') channel_id=4
    else if(this.props.id=='Diamond') channel_id=5 
    else channel_id=6
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

  }
  componentDidMount() {

    //getting messages that will show when you just came to page
    axios.get(`/api/messages/${this.state.channel_id}`).then(res=>{
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
  axios.get(`/api/messages/${this.state.channel_id}`).then(res=>{
      this.setState({
    messages: res.data,
    input:''})
  })

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
      message: this.state.input,
      room: this.state.room
    }) 
 })     
}
filterArray(){
  if(this.state.filterString==='') alert("Please input beginning of battletag")
  else{
      let filterString=this.state.filterString;
  let filteredMessages=this.state.messages.filter(message=>message.battle_tag.split('').slice(0,filterString.split('').length).join('')==filterString).map((message,i)=>{
    return (<div key={i}><img src={message.hero} alt=""/> <p> {message.message_time} {message.battle_tag} {message.mmr}: {emojify(message.message)}</p></div>)
  })
  this.setState({filteredMessages,
    filterString:''
  })
  }

}
openWindow(){

  this.state.emoji?this.setState({emoji:false}):this.setState({emoji:true})
}
addEmoji(e){
  var input=this.state.input+":"+e+":"
this.setState({input})

}


  render() {
   console.log("EMO IS",this.state.emo)
    //creating message list by mapping thru messages
    let messages=this.state.messages.map((message,i)=>{
    return (<div key={i}><img src={message.hero} alt=""/> <p> {message.message_time} {message.battle_tag} {message.mmr}: {emojify(message.message)}</p> {/*LIKE BUTTON*/}<button onClick={()=>{
        let action="like"
        let number=message.like+1;
        let{user_id, message_time}=message;
        let channel_id=this.state.channel_id
        axios.put('/api/like',{action,number,user_id,message_time,channel_id} ).then(res=>{

          this.socket.emit('message sent', {
            message: this.state.input,
            room: this.state.room
          }) 
        })
      
      }}><img src="https://d30y9cdsu7xlg0.cloudfront.net/png/114472-200.png" alt="fire" height="20px" width="20px"/>
      </button>{message.like} {/*DISLIKE BUTTON*/}<button onClick={()=>{
        let action="dislike"
        let number=message.dislike+1;
        let{user_id, message_time}=message;
        let channel_id=this.state.channel_id
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
                <h2>  

                  {this.state.filteredMessages.length>0?
                  this.state.filteredMessages:
                  messages

                  }
                </h2>
                {/* writing new message */}
              <input value={this.state.input} onChange={e => {
                this.setState({input: e.target.value})}} />


                <button onClick={this.openWindow}>emoji</button>
                
                {/* Checking if somebody press emoji button and open menu */}
                {this.state.emoji?
                <MyEmojiInput addEmoji={this.addEmoji}/>:
                <p></p>
              }
                
              
              <button onClick={this.sendMessage}>Send</button>
              <p> Search it by battletag </p> 
              {/*writing filter name string*/}
              <input value={this.state.filterString} onChange={e=>{
                this.setState({filterString:e.target.value })}} />
              <button onClick={this.filterArray}> Search</button>
              {/* deleting filtered array */}
              <button onClick={()=>{
                this.setState({filteredMessages:[]})
              }}> Show all</button>
             
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
