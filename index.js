/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';
import {Provider as StoreProvieder} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './src/modules/index';
import ReduxThunk from 'redux-thunk';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const Root = () => (
  <StoreProvieder store={store}>
    <PaperProvider>
      <App />
    </PaperProvider>
  </StoreProvieder>
);

AppRegistry.registerComponent(appName, () => Root);
// AppRegistry.registerComponent(appName, () => App);
