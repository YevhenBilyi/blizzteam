import React, { Component } from 'react';
import './Auth.css';

class Auth extends Component {
  render() {
    return (
      <div className="Auth">
                   <a href={process.env.REACT_APP_LOGIN}>
                <button>Login </button>
            </a>
      </div>
    );
  }
}

export default Auth;
