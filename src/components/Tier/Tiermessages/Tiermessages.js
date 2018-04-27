import React, { Component } from 'react';
import io from 'socket.io-client';
import './Tiermessages.css';
import {connect} from 'react-redux';

class Tiermessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      message: [],
      room: this.props.id
    }

    this.updateMessage = this.updateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);

  }
  componentDidMount() {
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
    console.log(message,this.props.user.hero)
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.setState({
      message:[...this.state.message, {hero:this.props.user.hero, battle_tag: this.props.user.battle_tag, mmr:this.props.user.mmr, time, message  }]
    })
  }
  sendMessage() {
    this.socket.emit('message sent', {
      message: this.state.input,
      room: this.state.room
    })
  }


  render() {
    let messages=this.state.message.map((message,i)=>{
      return (<div key={i}><img src={message.hero} alt=""/> <p> {message.time} {message.battle_tag} {message.mmr}: {message.message}</p></div>)
    })
    return (
      <div className="App">
     <h1>My Room: {this.state.room}</h1> 
        <h2>{messages}</h2>
        {
            <div>
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
export default connect(mapStateToProps)(Tiermessages) ;
