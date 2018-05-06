import React, { Component } from 'react';
import io from 'socket.io-client';
import './Privatemessages.css';
import {connect} from 'react-redux';
import axios from 'axios';

class Privatemessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      messages:[],
      room: this.props.id,
      filterString:'',
      filteredMessages:[]
    }

    this.updateMessage = this.updateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.componentDidMount=this.componentDidMount.bind(this);

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



  render() {
    //creating message list by mapping thru messages
    let messages=this.state.messages.map((message,i)=>{
      return (<div key={i}><img src={message.profile_picture} alt=""/> <p> {message.message_time} {message.battle_tag} {message.mmr}: {message.message}</p></div>)
    })

    

    return (
      <div className="App">
     <h1>My Room: {this.state.room}</h1> 
       
        {
            <div>
                <h2> {messages}</h2>
                {/* writing new message */}
              <input value={this.state.input} onChange={e => {
                this.setState({
                  input: e.target.value
                })
              }} />
              
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
