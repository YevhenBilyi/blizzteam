import React, { Component } from 'react';
import './Nav.css';
import {Link} from 'react-router-dom';

class Nav extends Component {
  render() {
    return (
      <div className="Nav">
        <Link to='/tier'>Main Chat </Link>
        <Link to='/private/1'>Private Chat </Link>
        <Link to='/profile/1'>My Profile </Link>
        <a href='http://localhost:3004/logout'>
                            <button>Logout</button>
                        </a>
      </div>
    );
  }
}

export default Nav;
