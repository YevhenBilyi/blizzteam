import React, { Component } from 'react';
import './Auth.css';

class Auth extends Component {
  render() {

    return (
      <section >
      <div className="unauthorized">
      <div id="logo">
          <h1>BlizzTeam </h1>
          <p>BUILD YOUR TEAM AND UP YOUR RANK</p>
          </div>
              <div id="login">
      <a href={process.env.REACT_APP_LOGIN}>

                <button >LOGIN </button>  
                
            </a>
           
            </div> 
     


            <div id="footer">
            <p>FIND TEAMMATES FOR  </p> 
            <img src="https://vignette.wikia.nocookie.net/wowwiki/images/0/04/Heroes_of_the_Storm_logo.png/revision/latest?cb=20131019050303" alt=""/>
        </div>
        </div>
          </section> 
    );
  }
}

export default Auth;
