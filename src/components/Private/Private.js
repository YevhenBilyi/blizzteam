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


  render() {
    return (
      <div className="Private">
      {this.props.match.params.id=="main"?
      <div>
      Private 
      <Channels/>
      </div>:
      <div>
       Private
        <Channels />
        <Privatemessages id={this.props.match.params.id}/>
      </div>
    }

      </div>
    );
  }
}

export default Private;
