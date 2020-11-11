/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';
import {Provider as StoreProvieder} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {PersistGate} from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import configureStore from './src/store/index';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

const {store, persistor} = configureStore();

const Root = () => (
  <StoreProvieder store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </PersistGate>
  </StoreProvieder>
);

AppRegistry.registerComponent(appName, () => Root);
// AppRegistry.registerComponent(appName, () => App);
