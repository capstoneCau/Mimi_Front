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
import Geolocation from 'react-native-geolocation-service';
import {sendNotification} from '../modules/sendNotification';
import BackgroundTimer from 'react-native-background-timer';
import {FancyButton, FancyFonts} from '../common/common';
import {logoutAsync} from '../modules/login';
import {getInformation, getMbtiDestination} from '../modules/getInformation';
import KakaoLogins from '@react-native-seoul/kakao-login';
import Receivers from '../components/Receivers';
import localToInfo from '../common/LocalToInfo';
import infoToLocal from '../common/InfoToLocal';
import {
  getDistanceTimeByNaver,
  getDistanceTimeByOdySay,
  requestLocationPermission,
  getDistanceTwoPosition,
} from '../components/SafeReturn';
import {
  saveReceievers,
  changeUseSystemSafeReturn,
  startSafeReturn,
  stopSafeReturn,
} from '../modules/safeReturn';
import {check} from 'prettier';
export default function Setting({navigation}) {
  const myInfo = useSelector((state) => state.login);
  const friendInfo = useSelector((state) => state.myFriend);
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();
  const logout = useCallback((token) => dispatch(logoutAsync(token)), [
    dispatch,
  ]);

  const _saveReceievers = useCallback(
    (ids, names) => dispatch(saveReceievers(ids, names)),
    [dispatch],
  );
  const _changeUseSystemSafeReturn = useCallback(
    (isAuto) => dispatch(changeUseSystemSafeReturn(isAuto)),
    [dispatch],
  );
  const _startSafeReturn = useCallback(
    (safeReturnId) => dispatch(startSafeReturn(safeReturnId)),
    [dispatch],
  );
  const _stopSafeReturn = useCallback(() => dispatch(stopSafeReturn()), [
    dispatch,
  ]);

  useEffect(() => {
    requestLocationPermission();
    localToInfo('safeReturnId')
      .then((_safeReturnId) => {
        if (_safeReturnId != safeReturnId) {
          _startSafeReturn(_safeReturnId);
        }
      })
      .then(() => setInitializing(false));
  }, []);

  const {
    coordinate,
    notiReceiverIds,
    notiReceiverNames,
    destination,
    isSendMeetingMember,
    isAuto,
    safeReturnId,
  } = useSelector((state) => state.safeReturn);

  const [showFriendModal, setShowFriendModal] = useState(false);
  const [visibleMyInfo, setVisibleMyInfo] = useState(false);

  const [profileImgBase64, setProfileImgBase64] = useState();

  const [mbtiDescription, setMbtiDescription] = useState('');

  useEffect(() => {
    getInformation(myInfo.token)
      .then((response) => response)
      .then((result) => {
        setProfileImgBase64(result.image);
      });
    getMbtiDestination(myInfo.userInfo.mbti).then((result) => {
      setMbtiDescription(result.description);
    });
    localToInfo('safeReturnId').then((_safeReturnId) => {
      _startSafeReturn(_safeReturnId);
    });
    console.log(myInfo);
  }, []);

  const showMyInfo = () => setVisibleMyInfo(true);
  const hideMyInfo = () => setVisibleMyInfo(false);

  const kakaoLogout = async () => {
    console.log('Logout Start');
    try {
      const result = await KakaoLogins.logout();

      console.log(`Logout Finished:${result}`);
    } catch (err) {
      console.log(`Logout Failed:${err.code} ${err.message}`);
    }
  };

  const startSafeReturnFunc = async (friends) => {
    Geolocation.getCurrentPosition(
      (initPos) => {
        let orgLocation = null;
        orgLocation = {
          latitude: initPos.coords.latitude,
          longitude: initPos.coords.longitude,
        };
        if (notiReceiverIds) {
          friends = [...new Set(friends.concat(notiReceiverIds))];
          const idx = friends.indexOf(myInfo.kakaoId);
          if (idx != -1) {
            friends.splice(idx, 1);
          }
        }
        const {lat: latitude, lng: longitude} = coordinate;
        const watchingTime = 5;
        let remainTime = null;
        _startSafeReturn(
          BackgroundTimer.setInterval(async () => {
            Geolocation.getCurrentPosition((position) => {
              orgLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
            });
            if (orgLocation != null) {
              if (remainTime == null) {
                const naverTime = await getDistanceTimeByNaver(orgLocation, {
                  latitude,
                  longitude,
                });
                const odsayTime = await getDistanceTimeByOdySay(orgLocation, {
                  latitude,
                  longitude,
                });
                console.log(naverTime, odsayTime);
                remainTime = Math.max(naverTime, odsayTime);
              }
              remainTime -= watchingTime;
              if (remainTime <= 0) {
                BackgroundTimer.clearInterval(safeReturnId);
                infoToLocal('safeReturnId', null);
                sendNotification(
                  friends,
                  '긴급 구조 요청',
                  myInfo.name + '님께서 구조 요청을 하셨습니다.',
                  myInfo.token,
                );
              }
              const remainDistance = getDistanceTwoPosition(orgLocation, {
                latitude,
                longitude,
              });
              console.log(
                '위치와의 거리 : ',
                remainDistance,
                'm ',
                '남은 시간 : ',
                remainTime,
                's',
              );
              if (remainDistance < 100) {
                BackgroundTimer.clearInterval(safeReturnId);
                infoToLocal('safeReturnId', null);
              }
            }
          }, watchingTime * 1000),
        );
      },
      (error) => {
        console.log(error);
      },
    );
  };

  const showFriends = () => {
    setShowFriendModal(true);
  };
  const hideFriends = () => {
    setShowFriendModal(false);
  };
  if (initializing) return null;
  return (
    <View style={styles.container}>
      {showFriendModal && (
        <Receivers
          show={showFriendModal}
          hide={hideFriends}
          friendInfo={friendInfo.myFriend}
          setReceivers={_saveReceievers}
          notiReceiverIds={notiReceiverIds}
          isSendMeetingMember={isSendMeetingMember}
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
                value={isAuto}
                onValueChange={async () => {
                  // 스위치 off상태
                  if (!isAuto) {
                    if (coordinate) {
                      infoToLocal('autoSafeReturn', true);
                      _changeUseSystemSafeReturn(true);
                      Alert.alert('자동으로 안전 귀가 서비스가 실행됩니다.');
                    } else if (!coordinate) {
                      Alert.alert('목적지를 먼저 설정하여야 합니다.');
                    } else if (!isSendMeetingMember) {
                      Alert.alert('수신자를 먼저 설정하여야 합니다.');
                    }
                    // 스위치 on상태
                  } else {
                    infoToLocal('autoSafeReturn', false);
                    _changeUseSystemSafeReturn(false);
                  }
                }}
              />
            )}
          />
          <TouchableOpacity
            onPress={
              safeReturnId
                ? async () => {
                    BackgroundTimer.clearInterval(safeReturnId);
                    _stopSafeReturn();
                    Alert.alert('안전 귀가 서비스가 종료되었습니다.');
                  }
                : async () => {
                    if (
                      coordinate &&
                      notiReceiverIds &&
                      notiReceiverIds.length != 0 &&
                      !safeReturnId
                    ) {
                      const checkSafeReturnId = await localToInfo(
                        'safeReturnId',
                      );
                      if (checkSafeReturnId) {
                        Alert.alert('안전 귀가 서비스가 실행중입니다.');
                        _stopSafeReturn(checkSafeReturnId);
                      } else {
                        startSafeReturnFunc(
                          notiReceiverIds,
                          myInfo.userInfo.name,
                        );
                        Alert.alert('수동으로 안전 귀가 서비스가 실행됩니다.');
                      }
                    } else if (!coordinate) {
                      Alert.alert('목적지를 먼저 설정하여야 합니다.');
                    } else if (notiReceiverIds && notiReceiverIds.length == 0) {
                      Alert.alert('수신자를 먼저 설정하여야 합니다.');
                    } else if (safeReturnId) {
                      BackgroundTimer.clearInterval(safeReturnId);
                      Alert.alert('안전귀가 서비스를 종료합니다.');
                    }
                  }
            }>
            <List.Item
              title={
                safeReturnId ? '안전귀가서비스 종료' : '안전귀가서비스 실행'
              }
              left={(props) => <List.Icon {...props} icon="android-auto" />}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DestinationSetting');
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
                description={notiReceiverNames ? notiReceiverNames.join() : ''}
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
                      logout(myInfo.token)
                        .then(() => {
                          kakaoLogout();
                        })
                        .then(() => {
                          navigation.navigate('Login');
                        });
                      //navigation stack초기화 해야함
                    },
                  },
                ],
                {cancelable: false},
              );
            }}
          />
          <List.Item
            title="고객센터/도움말"
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
              size={100}
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
            <Text style={styles.mbtiText}>{myInfo.userInfo.mbti}</Text>
            <Text style={styles.mbtisubText}>({mbtiDescription})</Text>
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
  mbtiText: {
    fontSize: 30,
    marginTop: 20,
  },
  mbtisubText: {
    fontSize: 20,
  },
  bodyText: {
    marginTop: 20,
    fontSize: 30,
  },
  emailText: {
    fontSize: 17,
  },
});
