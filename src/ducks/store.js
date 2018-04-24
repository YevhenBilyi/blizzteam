import {createStore, applyMiddleware} from 'redux';
import reducer from './users';
import promiseMiddleWare from 'redux-promise-middleware'

let middleware=promiseMiddleWare();
export default createStore(reducer, applyMiddleware(middleware))