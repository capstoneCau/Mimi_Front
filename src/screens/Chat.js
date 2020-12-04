import React, {useState, useEffect, useCallback} from 'react';
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
  Appbar,
  Avatar,
  TextInput,
  Button,
  Paragraph,
  Dialog,
  Portal,
} from 'react-native-paper';
import {FancyButton, FancyFonts, backAction} from '../common/common';
import {removeMeeting} from '../modules/requestInfo';
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
  const [roomName, setRoomName] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectRoomId, setSelectRoomId] = useState(0);
  const [selectChatId, setSelectChatId] = useState(0);
  const myFriend = useCallback((token) => dispatch(myFriendList(token)), [
    dispatch,
  ]);
  const getMatchedRoom = useCallback(
    (token) => dispatch(getOwnsRoomList(token)),
    [dispatch],
  );

  const _removeMeeting = useCallback(
    (_roomId, _chatId, isNotification, _token) =>
      dispatch(removeMeeting(_roomId, _chatId, isNotification, _token)),
    [dispatch],
  );

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
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
          // console.log(querySnapshot.docs);
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
        <Appbar.Content title="채팅" />
        <Appbar.Action
          icon="autorenew"
          onPress={() => {
            setRestart(!restart);
          }}
        />
      </Appbar.Header>
      {/* <Text style={styles.titleText}>Matching</Text> */}
      {/* 방을 슬라이드 or 쭉 클릭하면 방 삭제하는 버튼 만들어야 함. */}
      <FlatList
        // data={roomInfos}
        data={threads}
        renderItem={
          roomInfos.length == 0
            ? ({item, index}) => {
                return null;
              }
            : ({item, index}) => {
                let room = null;
                roomInfos.forEach((val, idx) => {
                  if (item.roomId == val.room.id) {
                    room = val.room;
                  }
                });
                // console.log(roomInfos, threads, room);
                return (
                  <TouchableOpacity
                    // style={[
                    //   typeof item !== 'undefined'
                    //     ? item.room.status == 'm'
                    //       ? styles.list_container
                    //       : {display: 'none'}
                    //     : {display: 'none'},
                    // ]}
                    style={styles.list_container}
                    onLongPress={() => {
                      setSelectRoomId(item.roomId);
                      setSelectChatId(item._id);
                      // threads.forEach((val, idx) => {
                      //   if (item.room.id == val.roomId) {
                      //     setSelectChatId(val._id);
                      //   }
                      // });
                      showDialog();
                    }}
                    onPress={() => {
                      navigation.navigate('Messages', {
                        thread: item,
                      });
                      // threads.forEach((val, idx) => {
                      //   if (item.room.id == val.roomId) {
                      //     navigation.navigate('Messages', {
                      //       thread: val,
                      //       info: item.room,
                      //     });
                      //   }
                      // });
                    }}>
                    <View style={styles.list}>
                      <Text style={styles.peopleCount}>
                        {room !== null ? room.user_limit * 2 : ''}
                        {/* {room.user_limit * 2} */}
                      </Text>
                      <View style={styles.content}>
                        <Text style={styles.name}>
                          {item.name}
                          {/* {room.meeting.map((v, idx) => {
                            if (idx < 3) {
                              // if (myInfo.userInfo.name == v.name) {
                              //   return null;
                              // }
                              if (idx == room.user_limit * 2 - 1) {
                                return v.name;
                              }
                              return v.name + ', ';
                            } else {
                              return '...';
                            }
                          })} */}
                          {/* {typeof item !== 'undefined'
                      ? item.room.meeting.map((v, idx) => {
                          if (idx < 3) {
                            // if (myInfo.userInfo.name == v.name) {
                            //   return null;
                            // }
                            if (idx == item.room.user_limit * 2 - 1) {
                              return v.name;
                            }
                            return v.name + ', ';
                          } else {
                            return '...';
                          }
                        })
                      : ''} */}
                        </Text>
                        <Text style={styles.intro}>
                          {item.latestMessage.text}
                          {/* {typeof item !== 'undefined'
                      ? threads.map((val, idx) => {
                          if (item.room.id == val.roomId) {
                            return val.latestMessage.text;
                          }
                        })
                      : ''} */}
                        </Text>
                      </View>
                      <Text style={styles.dates}>
                        {room !== null
                          ? room.available_dates.map(
                              (v) =>
                                v.split('-')[1] +
                                '월' +
                                v.split('-')[2] +
                                '일\n',
                            )
                          : null}
                        {/* {typeof item !== 'undefined'
                          ? item.room.available_dates.map(
                              (v) =>
                                v.split('-')[1] +
                                '월' +
                                v.split('-')[2] +
                                '일\n',
                            )
                          : ''} */}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }
        }
        keyExtractor={(_item, index) => `${index}`}
      />
      <ChattingMenu
        visible={visible}
        hideDialog={hideDialog}
        setRoomName={setRoomName}
        deleteMeeting={_removeMeeting}
        token={myInfo.token}
        roomId={selectRoomId}
        chatId={selectChatId}
      />
    </SafeAreaView>
  );
}

const ChattingMenu = ({
  name,
  visible,
  hideDialog,
  setRoomName,
  deleteMeeting,
  token,
  roomId,
  chatId,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title style={{fontWeight: 'bold'}}>기능</Dialog.Title>
        <Dialog.Content>
          <TouchableOpacity
            onPress={() => {
              hideDialog();
              deleteMeeting(roomId, chatId, true, token);
            }}>
            <Paragraph style={styles.dialogText}>미팅종료</Paragraph>
          </TouchableOpacity>
        </Dialog.Content>
        <Dialog.Content>
          <TouchableOpacity
            onPress={() => {
              hideDialog();
              deleteMeeting(roomId, chatId, false, token);
            }}>
            <Paragraph style={styles.dialogText}>미팅삭제</Paragraph>
          </TouchableOpacity>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

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
  name: {
    alignSelf: 'flex-start',
    fontSize: 20,
    padding: 10,
    marginTop: 10,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  intro: {
    alignSelf: 'flex-start',
    fontSize: 15,
    padding: 15,
    color: 'gray',
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
  dialogText: {
    fontFamily: FancyFonts.BMDOHYEON,
  },
});
