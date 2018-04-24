import React, { Component } from 'react';
import routes from './routes';
import Nav from './components/Nav/Nav';
import './App.css';
import { withRouter } from 'react-router-dom'

class App extends Component {
  render() {
    return (
     
<div className="App">
      {this.props.location.pathname=='/' ?
         
          <div>
      {routes}
      </div>
      :
      <div>
      <Nav/> 
      {routes}
        </div>
      
      }
     </div>
    );
  }
}

export default withRouter(App);
