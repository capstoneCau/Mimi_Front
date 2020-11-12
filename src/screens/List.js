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
import {requestKaKaoAuthIdAsync} from '../modules/login';
import {myFriendList, getFriendInfo} from '../modules/myFriend';
import {getAllRoomList} from '../modules/meetingInfo';
import {participateAtRoom} from '../modules/requestInfo';

import App from '../../App';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function List({navigation}) {
  const {colors} = useTheme();
  const myInfo = useSelector((state) => state.login);
  const roomInfo = useSelector((state) => state.meetingInfo);
  const friendInfo = useSelector((state) => state.myFriend);
  const [friends, setFriends] = useState([]);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [removeFriend, setRemoveFriend] = useState(false);
  const [roomNum, setRoomNum] = useState(-1);
  const [restart, setRestart] = useState(false);
  //List 출력전 전부 해야하는 부분//
  const dispatch = useDispatch();
  const getUser = useCallback(
    (kakaoId) => dispatch(requestKaKaoAuthIdAsync(kakaoId)),
    [dispatch],
  );
  const myFriend = useCallback((token) => dispatch(myFriendList(token)), [
    dispatch,
  ]);
  const getAllRoom = useCallback((token) => dispatch(getAllRoomList(token)), [
    dispatch,
  ]);
  const participateRoom = useCallback(
    (participation_user_list, room_id, token) =>
      dispatch(participateAtRoom(participation_user_list, room_id, token)),
    [dispatch],
  );
  useEffect(() => {
    myFriend(myInfo.token);
    getAllRoom(myInfo.token);
  }, [restart]);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const resetFriend = () => {
    setFriends([]);
  };

  useEffect(() => {
    if (removeFriend) {
      resetFriend();
      setRemoveFriend(false);
    }
  }, [removeFriend]);

  const showFriends = () => {
    setFriends([]);
    setShowFriendModal(true);
  };
  const hideFriends = () => {
    setShowFriendModal(false);
  };

  const handleAdd = () => {
    setRestart(!restart);
    navigation.navigate('AddMeeting');
  };

  const handleSearch = () => {
    console.log('Search!');
  };
  return (
    <SafeAreaView style={styles.container}>
      {showFriendModal && (
        <Friends
          showFriendModal={showFriendModal}
          hideFriends={hideFriends}
          friendInfo={friendInfo.myFriend}
          removeFriend={removeFriend}
          setRemove={setRemoveFriend}
          friends={friends}
          setFriends={setFriends}
          participateRoom={participateRoom}
          roomNum={roomNum}
          token={myInfo.token}
        />
      )}
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="미팅목록" />
        <Appbar.Action
          icon="autorenew"
          onPress={() => {
            setRestart(!restart);
          }}
        />
        <Appbar.Action icon="comment-search-outline" onPress={handleAdd} />
        <Appbar.Action icon="comment-plus-outline" onPress={handleAdd} />
      </Appbar.Header>
      <FlatList
        data={roomInfo.allRoomList}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[
              item.status == 'm' ? {display: 'none'} : styles.list_container,
            ]}
            onPress={() => {
              showFriends();
              setRoomNum(item.id);
            }}>
            <View style={styles.list}>
              <Text style={styles.peopleCount}>{item.user_limit}</Text>
              <View style={styles.content}>
                <Text style={styles.school}>
                  {item.meeting
                    ? item.meeting.map((v) => {
                        return v.mbti + '/';
                      })
                    : null}
                </Text>
                <Text style={styles.intro}>{item.introduction}</Text>
              </View>
              <Text style={styles.dates}>
                {item.available_dates
                  ? item.available_dates.map(
                      (v) => v.split('-')[1] + '월' + v.split('-')[2] + '일\n',
                    )
                  : null}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_item, index) => `${index}`}
      />
    </SafeAreaView>
  );
}

function Friends({
  showFriendModal,
  hideFriends,
  friendInfo,
  friends,
  setFriends,
  participateRoom,
  roomNum,
  token,
}) {
  const [isAdd1, setIsAdd1] = useState(false);
  const [isAdd2, setIsAdd2] = useState(false);
  const [isAdd3, setIsAdd3] = useState(false);
  const [isAdd4, setIsAdd4] = useState(false);
  const [isAdd5, setIsAdd5] = useState(false);
  const [isAdd6, setIsAdd6] = useState(false);
  let friendName = [];
  let friendId = [];
  friendInfo.forEach((val) => {
    friendName.push(val.to_user.name);
    friendId.push(val.to_user.kakao_auth_id);
  });
  return (
    <View>
      <Portal>
        <Dialog visible={showFriendModal} onDismiss={hideFriends}>
          <Dialog.Title style={styles.text}>멤버추가</Dialog.Title>
          <Dialog.Content>
            <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd1 === false) {
                    setFriends((old) => [...old, friendId[0]]);
                  } else {
                    setFriends(friends.filter((e) => e !== friendId[0]));
                  }
                  /* 3항연산자로 하면 왜 안될까? */
                  setIsAdd1(!isAdd1);
                }}
                value={friendName[0]}
                status={isAdd1 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>{friendName[0]}</Text>
            </View>
            <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd2 === false) {
                    setFriends((old) => [...old, friendId[1]]);
                  } else {
                    setFriends(friends.filter((e) => e !== friendId[1]));
                  }
                  setIsAdd2(!isAdd2);
                }}
                value={friendName[1]}
                status={isAdd2 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>{friendName[1]}</Text>
            </View>
            {/* <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd3 === false) {
                    setFriends((old) => [...old, friendId[2]]);
                  } else {
                    setFriends(friends.filter((e) => e !== friendId[2]));
                  }
                  setIsAdd3(!isAdd3);
                }}
                value={friendName[2]}
                status={isAdd3 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>{friendName[2]}</Text>
            </View> */}
          </Dialog.Content>
          <Dialog.Actions>
            <FancyButton
              mode="outlined"
              color="#000069"
              onPress={() => {
                hideFriends();
                setFriends([]);
              }}>
              취소
            </FancyButton>
            <FancyButton
              mode="outlined"
              color="#000069"
              onPress={() => {
                participateRoom(friends, roomNum, token);
                hideFriends();
              }}>
              완료
            </FancyButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
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
  memberContainer: {
    flexDirection: 'row',
  },
  memberText: {
    fontFamily: FancyFonts.BMDOHYEON,
    marginTop: 8,
  },
});
