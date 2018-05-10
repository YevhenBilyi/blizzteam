import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Reload extends Component {

  render() {
    return <Redirect to={`/private/${this.props.match.params.id}`} />

  }
}

export default Reload ;
