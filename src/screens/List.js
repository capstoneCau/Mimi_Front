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
  Checkbox,
  Portal,
  Dialog,
  useTheme,
  RadioButton,
  Searchbar,
} from 'react-native-paper';
import StateInfoModal from '../components/StateInfoModal';
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
  const [visible, setVisible] = useState(false);
  // const [requestId, setRequestId] = useState(0);
  const [roomType, setRoomType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [searchNumId, setSearchNumId] = useState([
    {state: true},
    {state: true},
    {state: true},
  ]);
  const [searchPeople, setSearchPeople] = useState([2, 3, 4]);
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
    setRestart(!restart);
  }, []);

  useEffect(() => {
    if (removeFriend) {
      resetFriend();
      setRemoveFriend(false);
    }
  }, [removeFriend]);

  useEffect(() => {
    setSearchPeople([]);
    searchNumId.forEach((val, idx) => {
      if (val.state) {
        setSearchPeople((state) => state.concat(idx + 2));
      }
    });
  }, [searchNumId]);

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

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  const onChangeSearch = (query) => setSearchQuery(query);

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
        <Appbar.Action
          icon={isSearch ? 'cancel' : 'comment-search-outline'}
          onPress={() => {
            setIsSearch(!isSearch);
          }}
        />
        <Appbar.Action icon="comment-plus-outline" onPress={handleAdd} />
      </Appbar.Header>
      <View style={[isSearch ? null : {display: 'none'}]}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <View style={styles.Checkbox}>
          <Checkbox.Item
            label="2명"
            status={searchNumId[0].state ? 'checked' : 'unchecked'}
            onPress={() => {
              let newArr = [...searchNumId];
              newArr[0].state = !newArr[0].state;
              setSearchNumId(newArr);
            }}
          />
          <Checkbox.Item
            label="3명"
            status={searchNumId[1].state ? 'checked' : 'unchecked'}
            onPress={() => {
              let newArr = [...searchNumId];
              newArr[1].state = !newArr[1].state;
              setSearchNumId(newArr);
            }}
          />
          <Checkbox.Item
            label="4명"
            status={searchNumId[2].state ? 'checked' : 'unchecked'}
            onPress={() => {
              let newArr = [...searchNumId];
              newArr[2].state = !newArr[2].state;
              setSearchNumId(newArr);
            }}
          />
        </View>
      </View>
      <FlatList
        data={roomInfo.allRoomList.map((val) => {
          if (searchPeople.indexOf(val.user_limit) > -1) {
            return val;
          }
        })}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[
              typeof item !== 'undefined'
                ? item.status == 'm'
                  ? {display: 'none'}
                  : styles.list_container
                : {display: 'none'},
            ]}
            onPress={() => {
              showModal();
              setRoomNum(item.id);
            }}>
            <View style={styles.list}>
              <Text style={styles.peopleCount}>
                {typeof item !== 'undefined' ? item.user_limit : ''}
              </Text>
              <View style={styles.content}>
                <Text style={styles.school}>
                  {typeof item !== 'undefined'
                    ? item.meeting.map((v) => {
                        return v.mbti + '/';
                      })
                    : null}
                </Text>
                <Text style={styles.intro}>
                  {typeof item !== 'undefined' ? item.introduction : ''}
                </Text>
              </View>
              <Text style={styles.dates}>
                {typeof item !== 'undefined'
                  ? item.available_dates.map(
                      (v) => v.split('-')[1] + '월' + v.split('-')[2] + '일\n',
                    )
                  : ''}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_item, index) => `${index}`}
      />
      <StateInfoModal
        visible={visible}
        hideModal={hideModal}
        token={myInfo.token}
        roomId={roomNum}
        roomType={roomType}
        roomState="L"
        showFriends={showFriends}
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
            {/* <View style={styles.memberContainer}>
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
            </View> */}
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
  Checkbox: {
    flexDirection: 'row',
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
