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
import {startSafeReturnFunc} from './src/components/SafeReturn';
import PushNotification from 'react-native-push-notification';
// import NotifService from './NotifService';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (remoteMessage.notification) {
    const {title: ntitle, body: nbody} = remoteMessage.notification;
    const {body, title} = remoteMessage.notification;
    PushNotification.cancelAllLocalNotifications();
    if (remoteMessage.data && remoteMessage.data.title == 'SAFE_RETURN') {
      if (await localToInfo('autoSafeReturn')) {
        PushNotification.localNotification({
          channelId: 'fcm_default_channel',
          title: title,
          message: body,
          invokeApp: false,
        });
      } else {
        PushNotification.localNotification({
          channelId: 'fcm_default_channel',
          title: '미팅이 종료되었습니다.',
          message: '미팅이 종료되었습니다.',
          invokeApp: false,
        });
      }
    } else {
      PushNotification.localNotification({
        channelId: 'fcm_default_channel',
        title: title,
        message: body,
        invokeApp: false,
      });
    }
  }
  if (remoteMessage.data) {
    const {title, body} = remoteMessage.data;
    if (title == 'SAFE_RETURN' && (await localToInfo('autoSafeReturn'))) {
      const safeReturnId = await localToInfo('safeReturnId');
      const isSendMeetingMember = await localToInfo('isSendMeetingMember');
      const meetingMember = [];
      const myInfo = await localToInfo('userInfo');
      if (isSendMeetingMember) {
        JSON.parse(body).forEach((val) => {
          if (val.gender == myInfo.gender && val.id != myInfo.kakao_auth_id) {
            meetingMember.push(val.id);
          }
        });
      }
      if (safeReturnId == null) {
        startSafeReturnFunc(meetingMember, myInfo.name);
      }
    }
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
