import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Appbar,
  List,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Portal,
  Dialog,
  useTheme,
  RadioButton,
} from 'react-native-paper';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {FancyButton, FancyFonts} from '../common/common';
import {logoutAsync} from '../modules/login';
import KakaoLogins from '@react-native-seoul/kakao-login';
import Friends from '../components/Friends';

export default function Setting({navigation, route}) {
  const myInfo = useSelector((state) => state.login);
  const friendInfo = useSelector((state) => state.myFriend);
  const dispatch = useDispatch();
  const logout = useCallback((token) => dispatch(logoutAsync(token)), [
    dispatch,
  ]);
  const [logoutLoading, setLogoutLoading] = useState(false);
  // const [unlinkLoading, setUnlinkLoading] = useState(false);
  const [token, setToken] = useState(TOKEN_EMPTY);
  const [profile, setProfile] = useState(PROFILE_EMPTY);
  const [destination, setDestination] = useState(); // 목적지
  const [friends, setFriends] = useState([]); // friends kakao auth Id
  const [friendsName, setFriendsName] = useState([]);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const user = useSelector((state) => state.login);
  const _destination =
    typeof route.params == 'undefined' ? '' : route.params.destination;
  useEffect(() => {
    setDestination(_destination);
  }, [_destination]);

  const logCallback = (log, callback) => {
    console.log(log);
    callback;
  };
  const TOKEN_EMPTY = 'token has not fetched';
  const PROFILE_EMPTY = {
    id: 'profile has not fetched',
    email: 'profile has not fetched',
    profile_image_url: '',
  };

  const kakaoLogout = async () => {
    logCallback('Logout Start', setLogoutLoading(true));
    try {
      const result = await KakaoLogins.logout();
      setToken(TOKEN_EMPTY);
      setProfile(PROFILE_EMPTY);
      logCallback(`Logout Finished:${result}`, setLogoutLoading(false));
    } catch (err) {
      logCallback(
        `Logout Failed:${err.code} ${err.message}`,
        setLogoutLoading(false),
      );
    }
  };

  const showFriends = () => {
    setFriends([]);
    setShowFriendModal(true);
  };
  const hideFriends = () => {
    setShowFriendModal(false);
  };
  console.log(friends);
  return (
    <View style={styles.container}>
      {showFriendModal && (
        <Friends
          showFriendModal={showFriendModal}
          hideFriends={hideFriends}
          onChange={setFriendsName}
          friendsName={friendsName}
          friendInfo={friendInfo.myFriend}
          friends={friends}
          setFriends={setFriends}
          type="s"
        />
      )}
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="설정" />
      </Appbar.Header>
      <ScrollView>
        <List.Section title="개인/보안">
          <List.Item
            title="내정보"
            left={(props) => <List.Icon {...props} icon="account" />}
          />
          <List.Item
            title="로그아웃"
            left={(props) => <List.Icon {...props} icon="logout" />}
            onPress={() => {
              Alert.alert(
                '로그아웃',
                '접속중인 기기에서 로그아웃 하시겠습니까?',
                [
                  {
                    text: '아니오',
                    style: 'cancel',
                  },
                  {
                    text: '네',
                    onPress: () => {
                      logout(myInfo.token);
                      kakaoLogout();
                      navigation.navigate('Login');
                      //navigation stack초기화 해야함
                    },
                  },
                ],
                {cancelable: false},
              );
            }}
          />
          <List.Item
            title="고각센터/도움말"
            left={(props) => <List.Icon {...props} icon="account-question" />}
          />
        </List.Section>
        <List.Section title="안전귀가서비스">
          <TouchableOpacity>
            <List.Item
              title="자동서비스"
              left={(props) => <List.Icon {...props} icon="android-auto" />}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <List.Item
              title="수동서비스"
              left={(props) => <List.Icon {...props} icon="android-auto" />}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DestinationSetting', {destination});
            }}>
            <List.Item
              title="목적지설정"
              description={destination}
              left={(props) => <List.Icon {...props} icon="home" />}
            />
            <TouchableOpacity
              onPress={() => {
                showFriends();
              }}>
              <List.Item
                title="수신자설정"
                description={friendsName}
                left={(props) => <List.Icon {...props} icon="account-alert" />}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </List.Section>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
});
