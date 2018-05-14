import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux';
import store from './ducks/store';
import {HashRouter} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';




ReactDOM.render(
    
<Provider store={store}>
<HashRouter>
<MuiThemeProvider >
<App />
</MuiThemeProvider >
</HashRouter>
</Provider>
, document.getElementById('root'));
// registerServiceWorker();
