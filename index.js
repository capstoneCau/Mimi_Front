/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import React from 'react';
import {name as appName} from './app.json';
import {Provider as StoreProvieder} from 'react-redux';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './src/modules/index';
import ReduxThunk from 'redux-thunk';
import messaging from '@react-native-firebase/messaging';
import localToInfo from './src/common/LocalToInfo';
import BackgroundTimer from 'react-native-background-timer';
import {startSafeReturnFunc} from './src/components/SafeReturn';
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const {title, body} = remoteMessage.data;
  const autoSafeReturn = await localToInfo('autoSafeReturn');
  if (title == 'SAFE_RETURN' && autoSafeReturn) {
    startSafeReturnFunc(JSON.parse(body));
  } else {
    console.log(autoSafeReturn);
  }
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

const Root = () => (
  <StoreProvieder store={store}>
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  </StoreProvieder>
);

AppRegistry.registerComponent(appName, () => Root);
// AppRegistry.registerComponent(appName, () => App);
