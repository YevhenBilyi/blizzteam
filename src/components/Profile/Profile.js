import React, { Component } from 'react';
import './Profile.css';
import {connect} from 'react-redux';
import {updateUser, getUser, getAllData} from '../../ducks/users';
import FileUpload from './FileUpload/FileUpload';
import Mainlist from './Mainlist/Mainlist';
import axios from 'axios';

class Profile extends Component {
    constructor(){
        super();
        this.state={
            server:1,
            battleTag:'',
            hero:null
        }
        this.handleServer=this.handleServer.bind(this);
        this.handleBattleTag=this.handleBattleTag.bind(this);
        this.saveChanges=this.saveChanges.bind(this);
        this.getHero=this.getHero.bind(this);
    }
componentDidMount(){
    this.props.getUser();
    this.props.getAllData();
}
handleServer(e){
    this.setState({server:e})
}
handleBattleTag(e){
    this.setState({battleTag:e})
}
saveChanges(heroes){
    //making sure to have name for main hero icon
    if(!this.state.hero) this.setState({hero:`http://s3.hotsapi.net/img/heroes/92x93/${heroes[0]}.png`}) 
    //doesn't empty name if input is clear
    if(this.state.battleTag=='') this.state.battleTag=this.props.user.battle_tag
    //getting mmr 
    axios.get(`https://api.hotslogs.com/Public/Players/${this.state.server}/${this.state.battleTag.split('#').join('_')}`).then(res=>{
        let tier='';
        //assigning right tier by the mmr
        if(res.data.LeaderboardRankings[1].CurrentMMR>2657) tier='Master'
        else if(res.data.LeaderboardRankings[1].CurrentMMR>2178) tier='Diamond'
        else if(res.data.LeaderboardRankings[1].CurrentMMR>1875) tier='Platinum'
        else if(res.data.LeaderboardRankings[1].CurrentMMR>1761) tier='Gold'
        else if (res.data.LeaderboardRankings[1].CurrentMMR>1675) tier='Silver'
        else tier='Bronze'
        // updating my database 
        this.props.updateUser(this.state.battleTag, this.state.server, res.data.LeaderboardRankings[1].CurrentMMR, tier, this.state.hero)
        this.setState({battleTag:''})
        //refreshing the page
        setTimeout(()=>window.location.reload(),1000)
        

    })
}
getHero(e){
    this.setState({hero:e})
}
  render() {
      console.log(this.props.allData[0])
    return (
      <div className="Profile">
      <p> Your profile picture</p> <img src={this.props.user.profile_picture} alt="profile_pic"/>
      <p> Your main:</p><img src={this.props.user.hero} alt="profile_pic"/>
      <p>Your battleTag: {this.props.user.battle_tag} </p>
      <p>Your server: {this.props.user.server_num} </p>
      <p>Your mmr: {this.props.user.mmr} </p>
      <p>Your tier: {this.props.user.tier} </p>
                            <p>Your main region:</p>
                
                <select onChange={e=> this.handleServer(e.target.value)}>

                    <option type="text" value='1' >US</option>
                    <option type="text" value='2' >EU</option>
                    <option type="text" value='3' >KR</option>
                    <option type="text" value='5' >CN</option>
                </select> <br/>
                <p>Your BattleTag:</p>
                <input placeholder='name#number' type='text' value={this.state.battleTag} onChange={e=>this.handleBattleTag(e.target.value)}/>
                
            
                <Mainlist getHero={this.getHero} saveChanges={this.saveChanges} />
                

                <FileUpload/> <br/>
      </div>
    );
  }
}

function mapStateToProps(state){
    return state
}

export default connect(mapStateToProps, {updateUser, getUser, getAllData})(Profile) ;
