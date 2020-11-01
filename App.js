import React, { useState, useEffect, useCallback } from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import merge from 'deepmerge';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StackActions} from '@react-navigation/native';
import * as name from './src/screens/index';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import { fcmTokenAsync } from './src/modules/login';

const Stack = createStackNavigator();
const BottomTabs = createBottomTabNavigator();
const TopTabs = createMaterialTopTabNavigator();

const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    manBackground: ['#fad0c4', '#ffd1ff'],
    womanBackground: ['#c2e9fb', '#a1c4fd'],
    modalBackground: 'rgba(80,80,80,0.3)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

const  App = () => {
  const {
    Login,
    SignUp,
    List,
    State,
    StateGive,
    StateTake,
    Chat,
    Setting,
    AddMeeting,
    GoogleMap,
  } = name;
  const [pushToken, setPushToken] = useState(null)
  const dispatch = useDispatch();
  const onFcmToken = useCallback((fcmToken) => dispatch(fcmTokenAsync(fcmToken)),[dispatch],);

  const foregroundListener  = useCallback(() => {
    messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage)
      const { body, title } = remoteMessage.notification
      Alert.alert(title, body);
    })
  }, []);

  const handlePushToken = useCallback(async () => {
    const enabled = await messaging().hasPermission()
    // console.log(enabled)
    if (enabled) {
      const fcmToken = await messaging().getToken()
      if (fcmToken) onFcmToken(fcmToken)
    } else {
      const authorizaed = await messaging.requestPermission()
      console.log(authorizaed)
    }
  }, [])

  useEffect(() => {
    handlePushToken()
    foregroundListener();
  }, []);

  const Navigator = () => {
    const loginStack = () => {
      return (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      );
    };

    const homeStack = () => {
      return (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={homeTab} />
        </Stack.Navigator>
      );
    };

    const ListStack = () => {
      return (
        <Stack.Navigator initialRouteName="List">
          <Stack.Screen name="List" component={List} />
          <Stack.Screen name="AddMeeting" component={AddMeeting} />
        </Stack.Navigator>
      );
    };

    const homeTab = () => {
      return (
        <BottomTabs.Navigator initialRouteName="List" backBehavior="none">
          <BottomTabs.Screen
            name="List"
            component={ListStack}
            options={{
              tabBarIcon: ({focused}) => {
                return focused ? (
                  <Icon name="list-sharp" size={30} />
                ) : (
                  <Icon name="list-outline" size={30} />
                );
              },
            }}
          />
          <BottomTabs.Screen
            name="State"
            component={topTab}
            options={{
              tabBarIcon: ({focused}) => {
                return focused ? (
                  <Icon name="person-sharp" size={30} />
                ) : (
                  <Icon name="person-outline" size={30} />
                );
              },
            }}
          />
          <BottomTabs.Screen
            name="Chat"
            component={Chat}
            options={{
              tabBarIcon: ({focused}) => {
                return focused ? (
                  <Icon name="chatbubble-sharp" size={30} />
                ) : (
                  <Icon name="chatbubble-outline" size={30} />
                );
              },
            }}
          />
          <BottomTabs.Screen
            name="Map"
            component={GoogleMap}
            options={{
              tabBarIcon: ({focused}) => {
                return focused ? (
                  <Icon name="navigate-sharp" size={30} />
                ) : (
                  <Icon name="navigate-outline" size={30} />
                );
              },
            }}
          />
          <BottomTabs.Screen
            name="Setting"
            component={Setting}
            options={{
              tabBarIcon: ({focused}) => {
                return focused ? (
                  <Icon name="settings-sharp" size={30} />
                ) : (
                  <Icon name="settings-outline" size={30} />
                );
              },
            }}
          />
        </BottomTabs.Navigator>
      );
    };

    const topTab = () => {
      return (
        <TopTabs.Navigator initialRouteName="State" backBehavior="none">
          <TopTabs.Screen name="대기" component={State} />
          <TopTabs.Screen name="요청한" component={StateGive} />
          <TopTabs.Screen name="요청받은" component={StateTake} />
        </TopTabs.Navigator>
      );
    };

    return (
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator initialRouteName="Login" headerMode="false">
          <Stack.Screen name="Login" component={loginStack} />
          <Stack.Screen name="Home" component={homeStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
  return <Navigator />;
}

export default App;
