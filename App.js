import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as name from './src/screens/index';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import localToInfo from './src/common/LocalToInfo';
import {requestKaKaoAuthIdAsync} from './src/modules/login';
import infoToLocal from './src/common/InfoToLocal';
import {startSafeReturnFunc} from './src/components/SafeReturn';
import PushNotification from 'react-native-push-notification';
import {getAnimalSimilarity} from './src/modules/animal';
import {useDispatch} from 'react-redux';

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

const App = () => {
  const {
    Login,
    SignUp,
    List,
    State,
    StateGive,
    StateTake,
    Chat,
    Messages,
    Setting,
    AddMeeting,
    Friend,
    DestinationSetting,
  } = name;
  const [isLogin, setIsLogin] = useState(false);
  const [initDestination, setInitDestination] = useState('Login');
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();
  const onLoginUser = useCallback(
    (kakaoId, fcmToken) => dispatch(requestKaKaoAuthIdAsync(kakaoId, fcmToken)),
    [dispatch],
  );
  const _getAnimalSimilarity = useCallback(
    (result) => dispatch(getAnimalSimilarity(result)),
    [dispatch],
  );

  const handlePushToken = useCallback(async (kakaoId) => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      const fcmToken = await messaging().getToken();
      console.log(fcmToken);
      if (fcmToken) {
        return onLoginUser(kakaoId, fcmToken);
      }
    } else {
      const authorizaed = await messaging.requestPermission();
    }
  }, []);

  useEffect(() => {
    // infoToLocal('kakaoId', '1496391237');
    // infoToLocal('kakaoId', '1489710892');
    // infoToLocal('kakaoId', '5555555555');
    // infoToLocal('kakaoId', '6666666666');
    // infoToLocal('kakaoId', '1111111111');
    // infoToLocal('kakaoId', '2222222222');
    // infoToLocal('kakaoId', '3333333333');
    // infoToLocal('kakaoId', '1234512345').then(() => {
    localToInfo('kakaoId')
      .then((kakaoId) => {
        return handlePushToken(kakaoId);
      })
      .then((_isLogin) => {
        if (_isLogin) {
          setInitDestination('Home');
        }
        setInitializing(false);
      });
    // });
  }, [isLogin]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        const {body, title} = remoteMessage.notification;
        PushNotification.localNotification({
          channelId: 'fcm_default_channel',
          title: title,
          message: body,
        });
      }
      if (remoteMessage.data) {
        const {title: dataTitle, body: dataBody} = remoteMessage.data;
        console.log(dataTitle, dataBody);
        if (dataTitle == 'SAFE_RETURN') {
          const autoSafeReturn = await localToInfo('autoSafeReturn');
          const isSwitchOn = await localToInfo('isSwitchOn');
          const friends = [];
          const myInfo = await localToInfo('userInfo');
          if (isSwitchOn) {
            JSON.parse(dataBody).forEach((val) => {
              if (
                val.gender == myInfo.userInfo.gender &&
                val.id != myInfo.userInfo.kakao_auth_id
              ) {
                friends.push(val.id);
              }
            });
          }
          if (autoSafeReturn) {
            startSafeReturnFunc(
              isSwitchOn ? friends : [],
              myInfo.userInfo.name,
            );
          } else {
            // console.log(autoSafeReturn);
          }
        }
        if (dataTitle == 'ANIMAL') {
          _getAnimalSimilarity(JSON.parse(dataBody));
        }
      }
    });
    PushNotification.configure({
      onRegister: (token) => {
        // console.log('Register Handler:', token);
      },
      onNotification: (notification) => {
        // console.log('Notification:', notification);
      },
      onAction: (notification) => {
        // console.log('Action:', notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    PushNotification.channelExists('default-channel-id', (exists) => {
      if (!exists) {
        PushNotification.createChannel({
          channelId: 'default-channel-id', // (required)
          channelName: `Default channel`, // (required)
          channelDescription: 'A default channel', // (optional) default: undefined.
          soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        });
      }
    });
    PushNotification.channelExists('fcm_default_channel', (exists) => {
      if (!exists) {
        PushNotification.createChannel({
          channelId: 'fcm_default_channel', // (required)
          channelName: 'FCM default channel', // (required)
          channelDescription: 'fcm_default_channel', // (optional) default: undefined.
          soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        });
      }
    });
    return () => unsubscribe();
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

    const ChatStack = ({navigation, route}) => {
      useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === 'Messages') {
          navigation.setOptions({tabBarVisible: false});
        } else {
          navigation.setOptions({tabBarVisible: true});
        }
      }, [navigation, route]);
      return (
        <Stack.Navigator initialRouteName="Chat">
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen
            name="Messages"
            component={Messages}
            options={({route}) => ({
              title: route.params.thread.name,
            })}
          />
        </Stack.Navigator>
      );
    };

    const SettingStack = () => {
      return (
        <Stack.Navigator initialRouteName="Setting">
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen
            name="DestinationSetting"
            component={DestinationSetting}
          />
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
            component={ChatStack}
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
            name="Friend"
            component={Friend}
            options={{
              tabBarIcon: ({focused}) => {
                return focused ? (
                  <Icon name="person-add-sharp" size={30} />
                ) : (
                  <Icon name="person-add-outline" size={30} />
                );
              },
            }}
          />
          <BottomTabs.Screen
            name="Setting"
            component={SettingStack}
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
        <Stack.Navigator initialRouteName={initDestination} headerMode="false">
          <Stack.Screen name="Login" component={loginStack} />
          <Stack.Screen name="Home" component={homeStack} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
  if (initializing) return null;
  return <Navigator />;
};

export default App;
