import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {
  Appbar,
  Avatar,
  TextInput,
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  Portal,
  Dialog,
  useTheme,
  RadioButton,
} from 'react-native-paper';
import {FancyButton, FancyFonts, backAction} from '../common/common';
import {getOwnsRoomList} from '../modules/meetingInfo';
import {myFriendList} from '../modules/myFriend';
import firestore from '@react-native-firebase/firestore';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Chat({navigation}) {
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);
  const [restart, setRestart] = useState('false');
  const [roomInfos, setRoomInfos] = useState([]);
  const dispatch = useDispatch();
  const myInfo = useSelector((state) => state.login);
  const roomInfo = useSelector((state) => state.meetingInfo);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const myFriend = useCallback((token) => dispatch(myFriendList(token)), [
    dispatch,
  ]);
  const getMatchedRoom = useCallback(
    (token) => dispatch(getOwnsRoomList(token)),
    [dispatch],
  );
  useEffect(() => {
    const getRoom = async () => {
      setRoomInfos(await getMatchedRoom(myInfo.token));
    };
    myFriend(myInfo.token);
    getRoom();
  }, [restart]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup('CHATINGS')
      .where('users', 'array-contains', myInfo.userInfo.kakao_auth_id)
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          console.log(querySnapshot.docs);
          const _threads = querySnapshot.docs.map((documentSnapshot) => {
            return {
              _id: documentSnapshot.id,
              name: '',
              latestMessage: {text: ''},
              users: [],
              ...documentSnapshot.data(),
            };
          });

          setThreads(_threads);
          console.log(_threads);
          if (loading) {
            setLoading(false);
          }
        },
        (error) => {
          console.log(error);
        },
      );

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="채팅창" />
        <Appbar.Action
          icon="autorenew"
          onPress={() => {
            setRestart(!restart);
          }}
        />
      </Appbar.Header>
      <Text style={styles.titleText}>Matching</Text>
      {/* 방을 슬라이드 or 쭉 클릭하면 방 삭제하는 버튼 만들어야 함. */}
      <FlatList
        data={roomInfos}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[
              typeof item !== 'undefined'
                ? item.room.status == 'm'
                  ? styles.list_container
                  : {display: 'none'}
                : {display: 'none'},
            ]}
            onPress={() => {
              threads.forEach((val, idx) => {
                if (item.room.id == val.roomId) {
                  navigation.navigate('Messages', {thread: val});
                }
              });
            }}>
            <View style={styles.list}>
              <Text style={styles.peopleCount}>
                {typeof item !== 'undefined' ? item.room.user_limit : ''}
              </Text>
              <View style={styles.content}>
                <Text style={styles.school}>
                  {typeof item !== 'undefined'
                    ? item.room.meeting.map((v) => {
                        return v.mbti + '/';
                      })
                    : ''}
                </Text>
                <Text style={styles.intro}>
                  {typeof item !== 'undefined' ? item.room.introduction : ''}
                </Text>
              </View>
              <Text style={styles.dates}>
                {typeof item !== 'undefined'
                  ? item.room.available_dates.map(
                      (v) => v.split('-')[1] + '월' + v.split('-')[2] + '일\n',
                    )
                  : ''}
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
    fontSize: 20,
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
  titleText: {
    fontSize: 25,
    fontFamily: FancyFonts.BMDOHYEON,
    textAlign: 'center',
    marginTop: 10,
  },
});
