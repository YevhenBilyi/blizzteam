import React, { Component } from 'react';
import io from 'socket.io-client';
import './Tiermessages.css';
import {connect} from 'react-redux';
import axios from 'axios';

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
      input: '',
      messages:[],
      room: this.props.id,
      filterString:'',
      channel_id,
      filteredMessages:[]
    }

    this.updateMessage = this.updateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.componentDidMount=this.componentDidMount.bind(this);
    this.filterArray=this.filterArray.bind(this);

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
  console.log("My filtered string",filterString)
  let filteredMessages=this.state.messages.filter(message=>message.battle_tag.split('').slice(0,filterString.split('').length).join('')==filterString).map((message,i)=>{
    return (<div key={i}><img src={message.hero} alt=""/> <p> {message.message_time} {message.battle_tag} {message.mmr}: {message.message}</p></div>)
  })
  this.setState({filteredMessages,
    filterString:''
  })
  console.log("Messages",filteredMessages)
  }

}


  render() {
    //creating message list by mapping thru messages
    let messages=this.state.messages.map((message,i)=>{
      return (<div key={i}><img src={message.hero} alt=""/> <p> {message.message_time} {message.battle_tag} {message.mmr}: {message.message}</p></div>)
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
