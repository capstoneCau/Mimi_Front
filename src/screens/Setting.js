import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {
  Appbar,
  List,
  Avatar,
  Switch,
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
import {getInformation} from '../modules/getInformation';
import KakaoLogins from '@react-native-seoul/kakao-login';
import Friends from '../components/Friends';
import localToInfo from '../common/LocalToInfo';
import infoToLocal from '../common/InfoToLocal';

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
  const [visibleMyInfo, setVisibleMyInfo] = useState(false);
  const [profileImgBase64, setProfileImgBase64] = useState();
  const [watchId, setWatchId] = useState();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isManualOn, setIsManulOn] = useState(false);
  const _destination =
    typeof route.params == 'undefined' ? '' : route.params.destination;
  useEffect(() => {
    getInformation(myInfo.token, 'profile')
      .then((response) => response)
      .then((result) => {
        setProfileImgBase64(result.image);
      });
  }, []);

  useEffect(() => {
    setDestination(_destination);
  }, [_destination]);

  useEffect(() => {
    localToInfo('safeReturnId').then((response) => {
      setWatchId(response);
      if (response !== null) {
        setIsSwitchOn(true);
      }
    });
  }, []);

  const showMyInfo = () => setVisibleMyInfo(true);
  const hideMyInfo = () => setVisibleMyInfo(false);

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
    setFriendsName([]);
    setShowFriendModal(true);
  };
  const hideFriends = () => {
    setShowFriendModal(false);
  };
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
          gender={myInfo.userInfo.gender}
        />
      )}
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="설정" />
      </Appbar.Header>
      <ScrollView>
        <List.Section title="안전귀가서비스">
          <List.Item
            title="자동서비스"
            left={(props) => <List.Icon {...props} icon="android-auto" />}
            right={(props) => (
              <Switch
                value={isSwitchOn}
                onValueChange={async () => {
                  const des = await localToInfo('destination');
                  // 스위치 off상태
                  if (!isSwitchOn) {
                    if (des) {
                      infoToLocal('autoSafeReturn', true);
                      Alert.alert('자동으로 안전 귀가 서비스가 실행됩니다.');
                      setIsSwitchOn(true);
                    } else {
                      Alert.alert('목적지를 먼저 설정하여야 합니다.');
                    }
                    // 스위치 on상태
                  } else {
                    setIsSwitchOn(false);
                  }
                }}
              />
            )}
          />
          <TouchableOpacity
            onPress={async () => {
              const des = await localToInfo('destination');
              if (des && !isSwitchOn) {
                infoToLocal('autoSafeReturn', false);
                Alert.alert('수동으로 안전 귀가 서비스가 실행됩니다.');
              } else if (!des) {
                Alert.alert('목적지를 먼저 설정하여야 합니다.');
              } else if (isSwitchOn) {
                Alert.alert('안전귀가 서비스 사용중입니다.');
              }
            }}>
            <List.Item
              title={isSwitchOn ? '서비스 종료' : '수동서비스'}
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
        <List.Section title="개인/보안">
          <List.Item
            title="내정보"
            left={(props) => <List.Icon {...props} icon="account" />}
            onPress={() => {
              showMyInfo();
            }}
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
      </ScrollView>
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={visibleMyInfo}
        onDismiss={hideMyInfo}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.header} onPress={hideMyInfo}>
            <Text style={styles.closeButton}>X</Text>
          </TouchableOpacity>
          <View style={styles.nameContainer}>
            <Avatar.Image
              size={150}
              source={{uri: `data:image/jpeg;base64,${profileImgBase64}`}}
            />
            <View style={styles.idContainer}>
              <Text style={styles.nameText}>{myInfo.userInfo.name}</Text>
              <Text style={styles.schoolText}>
                ({myInfo.userInfo.school.replace('학교', '학교 ')})
              </Text>
            </View>
          </View>

          {/* <Text>{myInfo.userInfo.gender}</Text> */}
          <View style={styles.bodyContainer}>
            {/* <Text style={styles.emailText}>({myInfo.userInfo.email})</Text> */}
            <Text style={styles.bodyText}>{myInfo.userInfo.mbti}</Text>
            <Text style={styles.bodyText}>{myInfo.userInfo.star}</Text>
            <Text style={styles.bodyText}>
              {myInfo.userInfo.chinese_zodiac}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  modalContainer: {},
  header: {
    margin: 30,
  },
  closeButton: {
    fontSize: 30,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 30,
  },
  idContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 40,
    marginLeft: 30,
  },
  idText: {
    fontSize: 17,
    marginLeft: 30,
  },
  bodyContainer: {
    marginLeft: 40,
    marginTop: 40,
  },
  schoolText: {
    fontSize: 17,
    marginLeft: 30,
  },
  bodyText: {
    marginTop: 20,
    fontSize: 30,
  },
  emailText: {
    fontSize: 17,
  },
});
