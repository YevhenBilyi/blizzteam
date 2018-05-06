import React, { Component } from 'react';
import './Channels.css';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class Channels extends Component {
  constructor(){
    super();
    this.state={
      search:'',
      filteredChats:[]
    }
  
  this.searchRoom=this.searchRoom.bind(this);
  }
  searchRoom(){
    let {user, users, channels}=this.props;
    if(this.state.search==='') alert("Please input beginning of battletag")
    else{
        let counter=0;
        let counter2=0;
        let search=this.state.search;
        
    console.log("My filtered string",search)
    //finding only channels with this player that not tier rooms
    let filteredChats=channels.filter(e=>e.id>6&&e.allowed_users.includes(user.id))
    .map((channel, i)=>{
      var usersNum=channel.allowed_users.filter(number=>number!=user.id);
      console.log("USERSNUM IS", usersNum)
      var usersNames=usersNum.map((number,j)=>{
        //checking if this channel have right player(if it is then counter>0)
        if(users[number-1].battle_tag.split('').slice(0,search.split('').length).join('')==search) ++counter;
        return (<p key={j}>{users[number-1].battle_tag}</p>)});
        if(counter>0){
          counter=0;
          counter2++;
          console.log("SECOND COUNTER",counter2)
          //showing only right channels, if there's atleast one then counter2>0
    return (<div key={i}> <p>Chat with:</p> <Link to={`private/${channel.id}`}><p>{usersNames}</p></Link> </div>)      
        }
      
    }).filter(e=>e!=undefined)
    //if there's no such rooms it'll show all rooms
    if(counter2==0) filteredChats=[];
    
    this.setState({filteredChats,
      search:''
    })
    }
  
  }
  render() {
    let {user, users, channels}=this.props;

    //finding only channels with this player that not tier rooms    
    let channelList=channels.filter(e=>e.id>6&&e.allowed_users.includes(user.id))
    .map((channel, i)=>{
      var usersNum=channel.allowed_users.filter(number=>number!=user.id);
      console.log("USERSNUM IS", usersNum)
      var usersNames=usersNum.map(number=>(<p>{users[number-1].battle_tag}</p>));
      return (<div key={i}> <p>Chat with:</p> <Link to={`private/${channel.id}`}><p>{usersNames}</p></Link> </div>)
    })
    return (
      <div className="Channels">
      <p> CHAT LIST </p>
        {this.state.filteredChats.length>0?
        this.state.filteredChats:
          
          
          channelList} 

      <p> Search by battleTag</p>
      {/* writing the battletag that want to be room shown with */}
      <input value={this.state.search} onChange={e=>{
        this.setState({search:e.target.value})}}/>
      <button onClick={this.searchRoom}>Search</button>
      {/* reset button */}
      <button onClick={()=>{this.setState({filteredChats:[]})}}>Show all</button>
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
export default connect(mapStateToProps)(Channels) ;
