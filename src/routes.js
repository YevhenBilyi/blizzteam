import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Auth from './components/Auth/Auth';
import Profile from './components/Profile/Profile';
import Tier from './components/Tier/Tier';
import Private from './components/Private/Private'
import Reload from './components/Reload/Reload'

export default(
    <Switch>
        <Route exact path='/' component={Auth}/>
        <Route path='/profile' component={Profile}/>
        <Route path='/tier/:id' component={Tier}/>
        <Route path='/private/:id' component={Private}/>
        <Route path='/reload/:id' component={Reload}/>

    </Switch>
)