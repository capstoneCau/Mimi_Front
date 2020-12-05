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
import {getInformation} from '../modules/getInformation';
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
  const [profileImgBase64, setProfileImgBase64] = useState();
  const [friendImage, setFriendImage] = useState([]);

  const myFriend = useCallback((token) => dispatch(myFriendList(token)), [
    dispatch,
  ]);
  const getMatchedRoom = useCallback(
    (token) => dispatch(getOwnsRoomList(token)),
    [dispatch],
  );

  const _removeMeeting = useCallback(
    (_roomId, isNotification, _token) =>
      dispatch(removeMeeting(_roomId, isNotification, _token)),
    [dispatch],
  );
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  useEffect(() => {
    getMatchedRoom(myInfo.token)
      .then((response) => response)
      .then((result) => {
        setRoomInfos(result);
      });
    myFriend(myInfo.token);
    getInformation(myInfo.token)
      .then((response) => response)
      .then((result) => {
        setProfileImgBase64(result.image);
      });
  }, [restart]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collectionGroup('CHATINGS')
      .where('users', 'array-contains', myInfo.userInfo.kakao_auth_id)
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
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
          typeof roomInfos == 'undefined'
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
                        myImg: profileImgBase64,
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
                      <View style={styles.imgAlbum}>
                        <View style={styles.imgAlbumRow}>
                          <Avatar.Image
                            size={35}
                            source={{uri: `${item.avatars[0]}`}}
                          />
                          <Avatar.Image
                            size={35}
                            source={{uri: `${item.avatars[1]}`}}
                          />
                        </View>
                        <View style={styles.imgAlbumRow}>
                          <Avatar.Image
                            size={35}
                            source={{uri: `${item.avatars[2]}`}}
                          />
                          <Avatar.Image
                            size={35}
                            source={{uri: `${item.avatars[3]}`}}
                          />
                        </View>
                        {/* {item.avatars.map((img, idx) => {
                          if (idx < 4) {
                            return (
                              <View style={styles.imgAlbum}>
                                <Avatar.Image
                                  key={idx}
                                  size={35}
                                  source={{uri: `${item.avatars[idx]}`}}
                                />
                              </View>
                            );
                          }
                        })} */}
                      </View>
                      <View style={styles.content}>
                        <View style={styles.roomName}>
                          <Text style={styles.name}>
                            {item.name.length > 14
                              ? item.name.substr(0, 13) + '...'
                              : item.name}
                          </Text>
                          <Text style={styles.peopleCount}>
                            {room !== null ? room.user_limit * 2 : ''}
                          </Text>
                        </View>
                        <View style={styles.message}>
                          <Text style={styles.intro}>
                            {item.latestMessage.text.length > 15
                              ? item.latestMessage.text.substr(0, 14) + '...'
                              : item.latestMessage.text}
                          </Text>
                          <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>
                              {new Date(
                                item.latestMessage.createdAt,
                              ).getHours()}
                              :
                              {new Date(
                                item.latestMessage.createdAt,
                              ).getMinutes()}
                            </Text>
                          </View>
                        </View>
                      </View>
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
              deleteMeeting(roomId, token, true);
            }}>
            <Paragraph style={styles.dialogText}>미팅종료</Paragraph>
          </TouchableOpacity>
        </Dialog.Content>
        <Dialog.Content>
          <TouchableOpacity
            onPress={() => {
              hideDialog();
              deleteMeeting(roomId, token, false);
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
    alignSelf: 'center',
    borderRadius: 10,
    borderBottomWidth: 0.2,
    backgroundColor: '#E8F5FF',
    marginTop: 3,
  },
  imgAlbum: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgAlbumRow: {
    flexDirection: 'column',
    margin: 1,
  },
  addBtn_container: {
    alignItems: 'center',
  },
  list: {
    flex: 1,
    flexDirection: 'row',
  },
  peopleCount: {
    fontSize: 15,
    color: 'gray',
    marginTop: 5,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  content: {
    flex: 5,
    marginLeft: 10,
    flexDirection: 'column',
  },
  roomName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    alignSelf: 'flex-start',
    fontSize: 20,
    padding: 10,
    marginTop: 10,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    position: 'absolute',
    right: 20,
  },
  timeText: {
    fontSize: 13,
    color: 'gray',
  },
  intro: {
    alignSelf: 'flex-start',
    fontSize: 13,
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
