import React, { Component } from 'react';
import './Tier.css';
import Users from './Users/Users';
import Tiermessages from './Tiermessages/Tiermessages';

class Tier extends Component {
  render() {
    return (
      <div className="Tier">
        Tier
        <Users id={this.props.match.params.id}/>
        <Tiermessages id={this.props.match.params.id}/>
      </div>
    );
  }
}

export default Tier;
