import { createStore, applyMiddleware, Action } from 'redux';
import ActionTypes from '../actions/ActionTypes';
import reducer from '../reducers';
import IStore from './IStore';
import handleAsyncAction from './middleware';
const logger = require('redux-logger');

const middleWares = [handleAsyncAction];

const loggerMid = logger.createLogger();

if (process.env.NODE_ENV === 'development') {
    middleWares.push(loggerMid);
}

const store = createStore<IStore, Action<ActionTypes>, any, any>(reducer, applyMiddleware(...middleWares));

export default store;