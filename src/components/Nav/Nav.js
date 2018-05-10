import React, { Component } from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class Nav extends Component {
  render() {
    const {
      REACT_APP_FAILURE_REDIRECT
  }=process.env;
    return (
      <div className="Nav">
        <Link to={`/tier/${this.props.user.tier}`}>Main Chat </Link>
        <Link to='/private/main'>Private Chat </Link>
        <Link to='/profile'>My Profile </Link>
        <a href={REACT_APP_FAILURE_REDIRECT}><button>Logout</button></a>
      </div>
    );
  }
}

function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(Nav) ;
