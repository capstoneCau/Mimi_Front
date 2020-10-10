/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';
import {Provider as StoreProvieder} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './src/modules/index';
import ReduxThunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const Root = () => (
  <StoreProvieder store={store}>
    <App />
  </StoreProvieder>
);

AppRegistry.registerComponent(appName, () => Root);
