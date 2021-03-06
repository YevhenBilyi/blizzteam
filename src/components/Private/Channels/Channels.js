import React, { Component } from 'react';
import './Channels.css';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Test from './Test/Test';


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
      var usersNum=channel.allowed_users.filter(number=>number!==user.id);
      console.log("USERSNUM IS", usersNum)
      var usersNames=users.filter(thisUser=>usersNum.includes(thisUser.id)).map((thisUser,j)=>{
        //checking if this channel have right player(if it is then counter>0)
        if(thisUser.battle_tag.split('').slice(0,search.split('').length).join('')===search) ++counter;
        return (<p key={j}>{thisUser.battle_tag}</p>)});
        if(counter>0){
          counter=0;
          counter2++;
          console.log("SECOND COUNTER",counter2)
          //showing only right channels, if there's atleast one then counter2>0
    return (<div key={i}><div> <p>Chat with:</p> <Link to={`/reload/${channel.id}`}><button>{usersNames}</button></Link></div><Test channelID={channel.id} usersNum={usersNum}/> </div>)      
        }
      
    }).filter(e=>e!==undefined)
    //if there's no such rooms it'll show all rooms
    if(counter2===0) filteredChats=[];
    
    this.setState({filteredChats,
      search:''
    })
    }
  
  }
  render() {

    console.log("MY USER IS===>",this.props.user, this.props.users, this.props.channels)
    let {user, users, channels}=this.props;

    //finding only channels with this player that not tier rooms    
    let channelList=channels.filter(e=>e.id>6&&e.allowed_users.includes(user.id))
    .map((channel, i)=>{
      console.log("MAIN USER ID---->",user.id)
      var usersNum=channel.allowed_users.filter(number=>number!==user.id);
      console.log("usersNum is!",usersNum)
      var usersNames=users.filter(user=> usersNum.includes(user.id)).map(user=><p>{user.battle_tag}</p>);
      return (<div className='elementchat' key={i}><div id='chatnamebutton'> <p>Chat with:</p> <Link to={`/reload/${channel.id}`}><button >{usersNames}</button></Link></div><div className='testbutton'><Test channelID={channel.id} usersNum={usersNum}/></div></div>)
    })
    return (
      <div className="Channels">
      <div id='privateheader'> CHAT LIST </div>
        <div id='chatlist'>
        {this.state.filteredChats.length>0?
        this.state.filteredChats:
          channelList} 
          </div>
        
            
       
      <p> Search by battleTag</p>
      <div id='privateinput'>
      <input value={this.state.search} onChange={e=>{
        this.setState({search:e.target.value})}}/>
        </div>
      <button onClick={this.searchRoom}>SEARCH</button>
      <div id='lastbutton'>
      <button onClick={()=>{this.setState({filteredChats:[]})}}>SHOW ALL</button>
      </div>
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
