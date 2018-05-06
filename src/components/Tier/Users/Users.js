import React, { Component } from 'react';
import './Users.css';
import {connect} from 'react-redux';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class Users extends Component {
  constructor(props){
    super(props)
    this.state={
      tier:this.props.id
    }
  }

  render() {
    console.log("MY CHANNELS!!!",this.props.channels)
    let {channels, users, user}=this.props;
    //filtering users that are in this tier and yourself
    let userList=users.filter(e=>e.tier==this.state.tier&&e.id!=user.id).map((e,i)=>{
      let counter=0;
      let link=<button key={i} onClick={()=>{
      //mapping thru the channels and looking for channel that have you and chosen user
      //if there's one it's giving you its id as a link        
      channels.map(channel=>{
        console.log("ALLOWED USERS-",channel.allowed_users, "this.props.user.id and e.id is", user.id, e.id)
      if (channel.allowed_users.includes(user.id)&&channel.allowed_users.includes(e.id)){
        counter++;
        this.props.history.push(`/private/${channel.id}`)

      }
      })
     //if you and user don't have any common channel it's creating one and giving you link to it      
            if(counter===0){
            axios.post('/api/channel', {user1:user.id, user2:e.id}).then(res=>{
            
              this.props.history.push(`/private/${res.data[0].id}`)
              console.log("RES.DATA",res.data[0].id)
        })
        
      } 
      }}
      
      >  {e.battle_tag} {e.mmr}  </button> 


 

      return link;

  })
    return (
      <div className="Users">
        {userList}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    user:state.user,
    users:state.users,
    channels:state.channels
  }
}
export default connect(mapStateToProps)(withRouter(Users)) ;
