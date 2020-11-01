import React, {useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {
  getInviterCreateRequest,
  getInviteeCreateRequest,
  getInviterParticipateRequest,
  getInviteeParticipateRequest,
  updateRequest,
} from '../modules/requestInfo';
import {useTheme} from '@react-navigation/native';
import {FancyFonts, backAction} from '../common/common';
import {updateScopes} from '@react-native-seoul/kakao-login';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default function State() {
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);
  const dispatch = useDispatch();
  const myInfo = useSelector((state) => state.login);
  const roomInfo = useSelector((state) => state.requestInfo);
  const getInviterCreate = useCallback(
    (token) => dispatch(getInviterCreateRequest(token)),
    [dispatch],
  );
  const getInviteeCreate = useCallback(
    (token) => dispatch(getInviteeCreateRequest(token)),
    [dispatch],
  );
  const getInviterParticipate = useCallback(
    (token) => dispatch(getInviterParticipateRequest(token)),
    [dispatch],
  );
  const getInviteeParticipate = useCallback(
    (token) => dispatch(getInviteeParticipateRequest(token)),
    [dispatch],
  );
  const update = useCallback(
    (type, isAccepted, requestId, token) =>
      dispatch(updateRequest(type, isAccepted, requestId, token)),
    [dispatch],
  );
  useEffect(() => {
    getInviterCreate(myInfo.token);
    getInviteeCreate(myInfo.token);
    getInviterParticipate(myInfo.token);
    getInviteeParticipate(myInfo.token);
  }, []);
  const {colors} = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <Text>create</Text>
      <FlatList
        data={roomInfo.inviterCreateList.concat(roomInfo.inviteeCreateList)}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[
              item.room.status == 'w'
                ? styles.list_container
                : {backgroundColor: '#dcdcdc'},
            ]}
            onPress={() => {
              if (item.user_role == 'invitee') {
                Alert.alert(
                  '확인해주세요',
                  '참가하시겠습니까?',
                  [
                    {
                      text: '취소',
                      style: 'cancel',
                    },
                    {
                      text: '아니오',
                      style: 'cancel',
                      onPress: () => {
                        update('create', 'r', item.id, myInfo.token);
                      },
                    },
                    {
                      text: '네',
                      onPress: () => {
                        update('create', 'a', item.id, myInfo.token);
                      },
                    },
                  ],
                  {cancelable: false},
                );
              } else {
                console.log('나는방장이야');
              }
            }}>
            <View style={styles.list}>
              <Text style={styles.peopleCount}>{item.room.user_limit}</Text>
              <View style={styles.content}>
                <Text style={styles.school}>{item.user.mbti}</Text>
                <Text style={styles.intro}>{item.room.introduction}</Text>
              </View>
              <Text style={styles.dates}>
                {item.room.available_dates.map(
                  (v) => v.split('-')[1] + '월' + v.split('-')[2] + '일\n',
                )}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_item, index) => `${index}`}
      />
      <Text>participate</Text>
      <FlatList
        data={roomInfo.inviterParticiatList.concat(
          roomInfo.inviteeParticiateList,
        )}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[
              item.room.status == 'a'
                ? styles.list_container
                : {backgroundColor: '#dcdcdc'},
            ]}
            onPress={() => {
              if (item.user_role == 'invitee') {
                Alert.alert(
                  '확인해주세요',
                  '참가하시겠습니까?',
                  [
                    {
                      text: '취소',
                      style: 'cancel',
                    },
                    {
                      text: '아니오',
                      style: 'cancel',
                      onPress: () => {
                        update('participate', 'r', item.id, myInfo.token);
                      },
                    },
                    {
                      text: '네',
                      onPress: () => {
                        update('participate', 'a', item.id, myInfo.token);
                      },
                    },
                  ],
                  {cancelable: false},
                );
              } else {
                console.log('나는방장이야');
              }
            }}>
            <View style={styles.list}>
              <Text style={styles.peopleCount}>{item.room.user_limit}</Text>
              <View style={styles.content}>
                <Text style={styles.school}>{item.user.mbti}</Text>
                <Text style={styles.intro}>{item.room.introduction}</Text>
              </View>
              <Text style={styles.dates}>
                {item.room.available_dates.map(
                  (v) => v.split('-')[1] + '월' + v.split('-')[2] + '일\n',
                )}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_item, index) => `${index}`}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  list_container: {
    height: height / 6,
    width: width,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 0.5,
  },
  addBtn_container: {
    alignItems: 'center',
  },
  list: {
    flex: 1,
    flexDirection: 'row',
  },
  peopleCount: {
    flex: 1.5,
    fontSize: 50,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: FancyFonts.BMDOHYEON,
  },
  content: {
    flex: 5,
    flexDirection: 'column',
  },
  school: {
    alignSelf: 'flex-start',
    fontSize: 30,
    padding: 10,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  intro: {
    alignSelf: 'flex-start',
    fontSize: 17,
    padding: 15,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  dates: {
    fontSize: 15,
    padding: 10,
    fontFamily: FancyFonts.BMDOHYEON,
  },
});
