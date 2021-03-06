import React, { Component } from 'react';
import {connect} from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {updateChannels} from '../../../../ducks/users';
import './Test.css'

class Test extends Component {
    constructor(){
        super();
        this.state={
            open:false,
            userList:[]
        }
    this.handleClose=this.handleClose.bind(this);
    this.handleOpen=this.handleOpen.bind(this);
    this.leaveChannel=this.leaveChannel.bind(this);
    this.removeFromChannel=this.removeFromChannel.bind(this);
    this.addToChannel=this.addToChannel.bind(this);
    
    }
handleOpen(){
    this.setState({open:true})
}
handleClose(){
    this.setState({open:false})
}
removeFromChannel(userID,channelID){

axios.put('/api/channels/remove',{userID, channelID}).then(res=>{
    this.setState({open:false})
    this.props.updateChannels(res.data);

})
}
leaveChannel(userID, channelID){
axios.put('/api/channels/remove',{userID, channelID}).then(res=>{
this.setState({open:false})
this.props.updateChannels(res.data);
this.props.history.push(`/reload/1`)
})
}
addToChannel(userID, channelID){
axios.put('/api/channels/add',{userID, channelID}).then(res=>{
    this.setState({open:false})
    this.props.updateChannels(res.data);
})
}

render() {
    const actions = [
        <FlatButton
          label="Go back"
          primary={true}
          onClick={this.handleClose}
        />]
        let {channelID, usersNum, users}=this.props
        let userList=users.map((user,i)=>{
            if(user.id===this.props.user.id){
                return <div className='insidebutton purple' key={i}>{user.battle_tag} {user.tier} <button onClick={()=>this.leaveChannel(user.id,channelID)}>Leave</button></div> 
            }
            else if(usersNum.includes(user.id)){
                return <div className='insidebutton' key={i}>{user.battle_tag} {user.tier} <button onClick={()=>this.removeFromChannel(user.id,channelID)}>Remove</button></div>
            }
            else{
                return <div className='insidebutton' key={i}>{user.battle_tag} {user.tier} <button onClick={()=>this.addToChannel(user.id, channelID)}>Add</button></div>
            }
        })
        let style={ width:'201px', height:'27px'}
    return (
      <div className="Test">
        <RaisedButton style={style} label="ADD/REMOVE" onClick={this.handleOpen} />
        <Dialog 
          title="Choose one"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {userList}
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {users:state.users,
        user:state.user}
}
export default connect(mapStateToProps, {updateChannels})(withRouter(Test)) ;
