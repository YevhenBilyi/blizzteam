import React, { Component } from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

class Nav extends Component {
  render() {

    return (
      <div className="Nav">
        <Link to={`/tier/${this.props.user.tier}`}>Main Chat </Link>
        <Link to='/private/1'>Private Chat </Link>
        <Link to='/profile'>My Profile </Link>
        <a href='http://localhost:3004/logout'>
                            <button>Logout</button>
                        </a>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {...state}
}
export default connect(mapStateToProps)(Nav) ;
