import React, { Component } from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import image from '../../img/menu_icon.svg'

class Nav extends Component {
  myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  render() {
    const {
      REACT_APP_FAILURE_REDIRECT
  }=process.env;
    return (
      <div id="Nav">
      <div class="dropdown">
      <button onClick={()=>this.myFunction()} class="dropbtn"><img src={image} alt="menu"/> </button>
      <div id="myDropdown" class="dropdown-content">
      
        <Link onClick={()=>this.myFunction()} to={`/tier/${this.props.user.tier}`}>MAIN </Link>
        <Link onClick={()=>this.myFunction()} to='/private/main'>PRIVATE </Link>
        <Link onClick={()=>this.myFunction()} to='/profile'>PROFILE </Link>
      
      </div>
      </div>
      <div id="middle">
      <img src="https://heroesofthestorm.com/static/images/heroes-2/logo-heroes-large.png?v=58-90" alt="menu"/>
      </div>
      <div id="logout">
      <a href={REACT_APP_FAILURE_REDIRECT}><button onClick={()=>axios.get('/logout')}>LOG OUT</button></a>
      </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(Nav) ;
