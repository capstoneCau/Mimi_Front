import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import merge from 'deepmerge';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as name from './src/screens/index';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const BottomTabs = createBottomTabNavigator();
const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    manBackground: ['#fdfbfb', '#ebedee'],
    womanBackground: ['#fad0c4', '#ffd1ff'],
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

function App() {
  const {
    Login,
    SignUp,
    List,
    State,
    Chat,
    Setting,
    AddMeeting,
    GoogleMap,
  } = name;

  const Navigator = () => {
    const loginStack = () => {
      return (
        <Stack.Navigator initialRouteName="SignUp">
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
            component={State}
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

    return (
      <NavigationContainer theme={MyTheme}>
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
