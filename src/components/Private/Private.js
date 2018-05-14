import React, { Component } from 'react';
import './Private.css';
import Channels from './Channels/Channels';
import Privatemessages from './Privatemessages/Privatemessages';


class Private extends Component {
  constructor(props){
    super(props)
    this.state={
      id:props.match.params.id
    }
  }
  myFunction() {
    var x = document.getElementById("privatechannels");
    var y = document.getElementById("privatemessages")
    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "none"
    } else {
        x.style.display = "none";
        y.style.display = "block"
    }
}


  render() {
    return (
      <div className="Private">
      {this.props.match.params.id==="main"?
      <div>
      <Channels/>
      </div>:
      <div >
      <div className="mainprivate">
      <div className='channelchannel'>
      <div id='switchbuttons'>
       <button  onClick={this.myFunction}>MESSAGES/CHANNELS</button>
       </div>
       <div id='privatechannels'>
        <Channels />
        </div>
        </div>
        
        <div id='privatemessages'>
        <Privatemessages id={this.props.match.params.id}/>
        </div>
        </div>
      </div>
    }

      </div>
    );
  }
}

export default Private;
