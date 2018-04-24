import React, { Component } from 'react';
import './Profile.css';
import {connect} from 'react-redux';
import {updateUser} from '../../ducks/users';
import axios from 'axios';

class Profile extends Component {
    constructor(){
        super();
        this.state={
            server:1,
            battleTag:''
        }
        this.handleServer=this.handleServer.bind(this);
        this.handleBattleTag=this.handleBattleTag.bind(this);
        this.saveChanges=this.saveChanges.bind(this);
    }
handleServer(e){
    console.log(e)
    this.setState({server:e})
}
handleBattleTag(e){
    this.setState({battleTag:e})
}
saveChanges(){
    console.log(this.state.server,  this.state.battleTag)
    axios.get(`https://api.hotslogs.com/Public/Players/${this.state.server}/${this.state.battleTag.split('#').join('_')}`).then(res=>{
        console.log(res.data.LeaderboardRankings[1].CurrentMMR)
        let tier='';
        if(res.data.LeaderboardRankings[1].CurrentMMR>2657) tier='Master'
        else if(res.data.LeaderboardRankings[1].CurrentMMR>2178) tier='Diamond'
        else if(res.data.LeaderboardRankings[1].CurrentMMR>1875) tier='Platinum'
        else if(res.data.LeaderboardRankings[1].CurrentMMR>1761) tier='Gold'
        else if (res.data.LeaderboardRankings[1].CurrentMMR>1675) tier='Silver'
        else tier='Bronze'
        console.log('Tier:'+tier)
        this.props.updateUser(this.state.battleTag, this.state.server, res.data.LeaderboardRankings[1].CurrentMMR, tier)
        this.setState({battleTag:''})
    })
}
  render() {
    return (
      <div className="Profile">
      <p>Your battleTag: {this.props.battleTag} </p>
      <p>Your server: {this.props.server} </p>
      <p>Your mmr: {this.props.mmr} </p>
      <p>Your tier: {this.props.tier} </p>
                            <p>Your main region:</p>
                
                <select onChange={e=> this.handleServer(e.target.value)}>

                    <option type="text" value='1' >US</option>
                    <option type="text" value='2' >EU</option>
                    <option type="text" value='3' >KR</option>
                    <option type="text" value='5' >CN</option>
                </select> <br/>
                <p>Your BattleTag:</p>
                <input placeholder='name#number' type='text' value={this.state.battleTag} onChange={e=>this.handleBattleTag(e.target.value)}/>
                <button onClick={this.saveChanges}> Save </button>
      </div>
    );
  }
}

function mapStateToProps(state){
    return state
}

export default connect(mapStateToProps, {updateUser})(Profile) ;
