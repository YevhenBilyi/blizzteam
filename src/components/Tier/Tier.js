import React, { Component } from 'react';
import './Tier.css';
import Users from './Users/Users';
import Tiermessages from './Tiermessages/Tiermessages';
import Bronze from '../../img/tiers/bronze1.png';
import Silver from '../../img/tiers/silver1.png';
import Gold from '../../img/tiers/gold1.png';
import Platinum from '../../img/tiers/platinum1.png';
import Diamond from '../../img/tiers/diamond1.png';
import Master from '../../img/tiers/master.png';

class Tier extends Component {
  myFunction() {
    var x = document.getElementById("usersdiv");
    var y = document.getElementById("tiermessages")
    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "none"
    } else {
        x.style.display = "none";
        y.style.display = "block"
    }
}
  render() {
    let tierIMG='';
    if(this.props.match.params.id==='Bronze')tierIMG=Bronze;
    else if(this.props.match.params.id==='Silver')tierIMG=Silver;
    else if(this.props.match.params.id==='Gold')tierIMG=Gold;
    else if(this.props.match.params.id==='Platinum')tierIMG=Platinum;
    else if(this.props.match.params.id==='Diamond')tierIMG=Diamond;
    else tierIMG=Master;
    return (
      <div className="Tier">
      <div id="messagesusers">
        <button  onClick={this.myFunction}>MESSAGES/USERS</button>
        
        </div>
        
        
        <div id="usersdiv">
        <Users tierIMG={tierIMG}id={this.props.match.params.id}/>
        </div >
        <div id="tiermessages">
        <Tiermessages id={this.props.match.params.id}/>
        </div>
      </div>
    );
  }
}

export default Tier;
