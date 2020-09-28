import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as name from './src/screens/index';

const Stack = createStackNavigator();
const BottomTabs = createBottomTabNavigator();

function App() {
  const {Login, SignUp, List, State, Chat, Setting, AddMeeting} = name;

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
        <BottomTabs.Navigator initialRouteName="List">
          <BottomTabs.Screen name="List" component={ListStack} />
          <BottomTabs.Screen name="State" component={State} />
          <BottomTabs.Screen name="Chat" component={Chat} />
          <BottomTabs.Screen name="Setting" component={Setting} />
        </BottomTabs.Navigator>
      );
    };

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={loginStack} />
          <Stack.Screen name="Home" component={homeStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
  return <Navigator />;
}

export default App;
