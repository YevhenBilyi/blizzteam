import React, { Component } from 'react';
import './Private.css';
import Channels from './Channels/Channels';
import Privatemessages from './Privatemessages/Privatemessages';

class Private extends Component {
  render() {
    return (
      <div className="Private">
        Private
        <Channels id={this.props.match.params.id}/>
        <Privatemessages id={this.props.match.params.id}/>
      </div>
    );
  }
}

export default Private;
