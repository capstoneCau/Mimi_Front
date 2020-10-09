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

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow',
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
