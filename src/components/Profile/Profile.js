import React, { Component } from 'react';
import './Profile.css';
import {connect} from 'react-redux';
import {updateUser, getUser, getAllUsers, getAllChannels} from '../../ducks/users';
import FileUpload from './FileUpload/FileUpload';
import Mainlist from './Mainlist/Mainlist';
import axios from 'axios';
import Bronze from '../../img/tiers/bronze1.png';
import Silver from '../../img/tiers/silver1.png';
import Gold from '../../img/tiers/gold1.png';
import Platinum from '../../img/tiers/platinum1.png';
import Diamond from '../../img/tiers/diamond1.png';
import Master from '../../img/tiers/master.png';


class Profile extends Component {
    constructor(){
        super();

        this.state={
            server:1,
            battleTag:'',
            hero:'',
            tier:'',
            mmr:0
        }
        this.handleServer=this.handleServer.bind(this);
        this.handleBattleTag=this.handleBattleTag.bind(this);
        this.saveChanges=this.saveChanges.bind(this);
        this.getHero=this.getHero.bind(this);
    }
componentDidMount(){
    this.props.getUser();
    this.props.getAllUsers();
    this.props.getAllChannels();
}
handleServer(e){
    this.setState({server:e})
}
handleBattleTag(e){
    this.setState({battleTag:e})
}
saveChanges(heroes){
    //making sure to have name for main hero icon
    console.log("BattleTag", this.state.battleTag, "User battletag", this.props.user.battle_tag)
    // if(this.state.hero==null) this.setState({hero:`http://s3.hotsapi.net/img/heroes/92x93/${heroes[0]}.png`}) 
    //doesn't empty name if input is clear
    // if(this.state.battleTag==null) this.setState({battleTag:this.props.user.battle_tag})

    if(this.state.tier!==''){
        console.log("YES")
        var tierNum=this.state.tier.split(' ')[1]
        var tier=this.state.tier.split(' ')[0]
    // updating my database 
        console.log("BATTLETAG2", this.state.battleTag)
        var newHero=this.state.hero===''?`http://s3.hotsapi.net/img/heroes/92x93/${heroes[0]}.png`:this.state.hero;
        var newTag=this.state.battleTag===''? this.props.user.battle_tag:this.state.battleTag;
    this.props.updateUser(newTag, tierNum, this.state.mmr, tier, newHero)
    this.setState({battleTag:'',
            tier:''})
    //refreshing the page
    }
    else{
        console.log("No")
    
    //getting mmr 
    var newTag=this.state.battleTag===''? this.props.user.battle_tag:this.state.battleTag;
    axios.get(`https://api.hotslogs.com/Public/Players/${this.state.server}/${newTag.split('#').join('_')}`).then(res=>{
        let tier='';
        let tierNum=0;
        //assigning right tier by the mmr
        console.log("RES.DATA IS",res.data)
        if(!res.data) alert("We didn't find your stats please use custom field")
        else if(res.data.LeaderboardRankings[1]===undefined) alert("We didn't find your stats please use custom field")
        else{
            this.setState({mmr:res.data.LeaderboardRankings[1].CurrentMMR})
        if(res.data.LeaderboardRankings[1].CurrentMMR>2657){
           tier='Master' ;
           tierNum=6;} 
        else if(res.data.LeaderboardRankings[1].CurrentMMR>2178){
           tier='Diamond' ;
           tierNum=5;} 
        else if(res.data.LeaderboardRankings[1].CurrentMMR>1875) {
            tier='Platinum';
            tierNum=4;}
        else if(res.data.LeaderboardRankings[1].CurrentMMR>1761){
           tier='Gold' ;
           tierNum=3;} 
        else if (res.data.LeaderboardRankings[1].CurrentMMR>1675){
            tier='Silver';
            tierNum=2;} 
        else {
            tier='Bronze';
            tierNum=1;} 
        // updating my database 
        var newHero=this.state.hero===''?`http://s3.hotsapi.net/img/heroes/92x93/${heroes[0]}.png`:this.state.hero;
        
        this.props.updateUser(newTag, tierNum, res.data.LeaderboardRankings[1].CurrentMMR, tier, newHero)
        this.setState({battleTag:''})
        //refreshing the page
        }})}
}
getHero(e){
    this.setState({hero:e})
}
  render() {
      let tierIMG='';
      if(this.props.user.tier==='Bronze') tierIMG=Bronze;
      else if(this.props.user.tier==='Silver') tierIMG=Silver;
      else if(this.props.user.tier==='Gold') tierIMG=Gold;
      else if(this.props.user.tier==='Platinum') tierIMG=Platinum;
      else if(this.props.user.tier==='Diamond') tierIMG=Diamond;
      else if(this.props.user.tier==='Master') tierIMG=Master;
      else tierIMG='';
    return (
      <div className="Profile">
      
      <div id="info">
      <div id="first">
       <div> < img src={this.props.user.profile_picture}  alt="profile_pic"/></div>
       <div id="battleTag">{this.props.user.battle_tag?this.props.user.battle_tag: "update your info below"} </div>
      </div>
      <div id="second">
      
      <div id="main"> <p>MMR: {this.props.user.mmr}</p> Main: </div><div id="heromain"><img src={this.props.user.hero} alt="profile_pic"/></div>
      <div ><div id="tierimg">{this.state.tierIMG===''? "":< img src={tierIMG}  alt="profile_pic"/>}</div>
       </div>
      </div>
      </div>
      <div class="block_1 hline-bottom"></div>
     
      <div id="update">
      <div > UPDATE YOUR PROFILE </div>
                            <div>Your main region:</div>
                
                <select className="select" onChange={e=> this.handleServer(e.target.value)}>

                    <option className="option" type="text" value='1' >US</option>
                    <option className="option" type="text" value='2' >EU</option>
                    <option className="option" type="text" value='3' >KR</option>
                    <option className="option" type="text" value='5' >CN</option>
                </select> <br/>
                
                <div>
                <p>BattleTag:</p>
                <input placeholder='name#number' type='text' value={this.state.battleTag} onChange={e=>this.handleBattleTag(e.target.value)}/>
                </div>
                <div>
                <p>(optional) </p>
                <p> Tier</p>
                <select onChange={e=> {this.setState({tier:e.target.value})}}>

                <option type="text" value='Bronze 1' >Bronze</option>
                <option type="text" value='Silver 2' >Silver</option>
                <option type="text" value='Gold 3' >Gold</option>
                <option type="text" value='Platinum 4' >Platinum</option>
                <option type="text" value='Diamond 5' >Diamond</option>
                <option type="text" value='Master 6' >Master</option>
                </select> <br/>              

                <Mainlist getHero={this.getHero} saveChanges={this.saveChanges} />
                </div>
            
                
                
                <div>Upload profile picture</div>
                <FileUpload/> 
            </div>
      </div>
    );
  }
}

function mapStateToProps(state){
    return state
}

export default connect(mapStateToProps, {updateUser, getUser, getAllChannels, getAllUsers})(Profile) ;
