import React, {useState, useEffect, useCallback} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ButtonGroup} from 'react-native-elements';
import {
  SafeAreaView,
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import {
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
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {requestKaKaoAuthIdAsync} from '../modules/login';
import {createRoomAsync} from '../modules/meetingInfo';

import {myFriendList} from '../modules/myFriend';
import {
  CONST_VALUE,
  FancyButton,
  FancyFonts,
  backAction,
} from '../common/common';
import DateTimePicker from 'react-native-modal-datetime-picker';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function AddMeeting({navigation}) {
  const dispatch = useDispatch();
  const getUser = useCallback(
    (kakaoId) => dispatch(requestKaKaoAuthIdAsync(kakaoId)),
    [dispatch],
  );
  const createRoom = useCallback(
    (init_users, available_dates, user_limit, introduction, token) =>
      dispatch(
        createRoomAsync(
          init_users,
          available_dates,
          user_limit,
          introduction,
          token,
        ),
      ),
    [dispatch],
  );
  const _myInfo = useSelector((state) => state.login);
  const _friendInfo = useSelector((state) => state.myFriend);

  useEffect(() => {
    BackHandler.removeEventListener('hardwareBackPress', backAction);

    return () => BackHandler.addEventListener('hardwareBackPress', backAction);
  }, []);
  const myInfo = {
    name: _myInfo.userInfo.name,
    school: _myInfo.userInfo.school.split('학교')[0],
    gender: _myInfo.userInfo.gender,
    birthDay: _myInfo.userInfo.birthDay,
    profileImg: _myInfo.userInfo.profileImg,
    mbti: _myInfo.userInfo.mbti,
  };
  const [meetingInfo, setMeetingInfo] = useState({
    peopleCount: 1,
    school: '',
    dates: [],
    intro: '',
  });
  const [friends, setFriends] = useState([]);

  const {peopleCount, school, dates, intro} = meetingInfo;
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [removeDate, setRemoveDate] = useState(false);
  const [removeFriend, setRemoveFriend] = useState(false);

  const changeMeetingInfo = (name, value) => {
    setMeetingInfo({
      ...meetingInfo,
      [name]: value,
    });
  };

  const resetFriend = () => {
    setFriends([]);
    changeMeetingInfo('peopleCount', 1);
  };

  useEffect(() => {
    if (removeFriend) {
      resetFriend();
      setRemoveFriend(false);
    }
  }, [removeFriend]);

  const showFriends = () => {
    changeMeetingInfo('peopleCount', 1);
    setFriends([]);
    setShowFriendModal(true);
  };
  const hideFriends = () => {
    setShowFriendModal(false);
  };
  return (
    <View style={styles.continer}>
      {showFriendModal && (
        <Friends
          showFriendModal={showFriendModal}
          hideFriends={hideFriends}
          onChange={changeMeetingInfo}
          peopleCount={peopleCount}
          friendInfo={_friendInfo.myFriend}
          removeFriend={removeFriend}
          setRemove={setRemoveFriend}
          friends={friends}
          setFriends={setFriends}
        />
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>새로운 미팅</Text>
      </View>
      <View style={styles.addFriednContainer}>
        <View style={styles.list}>
          <Text style={styles.peopleCount}>
            {peopleCount}
            {/* <Reset remove={removeFriend} setRemove={setRemoveFriend} /> */}
          </Text>
          <View style={styles.content}>
            <Text style={styles.school}>{myInfo.mbti}</Text>
            <Text style={styles.intro}>{intro}</Text>
          </View>
          <Text style={styles.dates}>
            {/* <Reset remove={removeDate} setRemove={setRemoveDate} /> */}

            {dates}
          </Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.datePickContainer}>
          <DatePick
            onChange={changeMeetingInfo}
            removeDate={removeDate}
            setRemove={setRemoveDate}
          />
          <AddFriend onChange={changeMeetingInfo} showFriends={showFriends} />
          <ShortIntroduce onChange={changeMeetingInfo} />
        </View>

        {/* <View style={styles.shortIntroduceContainer}>
          <ShortIntroduce onChange={changeMeetingInfo} />
        </View> */}
      </View>
      <View style={styles.completeContainer}>
        <FancyButton
          icon="arrow-right-bold"
          mode="outlined"
          color="#000069"
          onPress={() => {
            Alert.alert(
              '확인해주세요',
              '방을 생성하시겠습니까?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    const date = dates.map((x) => {
                      const month = x.split('/')[0].replace('\n', '');
                      const day = x.split('/')[1].split('(')[0];
                      if (month.length === 1) {
                        if (day.length === 1) {
                          return `2020-0${month}-0${day}`;
                        } else {
                          return `2020-0${month}-${day}`;
                        }
                      } else {
                        if (day.length === 1) {
                          return `2020-${month}-0${day}`;
                        } else {
                          return `2020-${month}-${day}`;
                        }
                      }
                    });
                    createRoom(
                      friends,
                      date,
                      peopleCount,
                      intro,
                      _myInfo.token,
                    );
                    navigation.navigate('List');
                  },
                },
              ],
              {cancelable: false},
            );
          }}>
          <Text style={styles.nextButtonText}>다음</Text>
        </FancyButton>
      </View>
    </View>
  );
}

function Reset({remove, setRemove}) {
  return (
    <View>
      <FancyButton
        mode="outlined"
        color="#000069"
        onPress={() => {
          setRemove(!remove);
        }}>
        <Text style={styles.text}>X</Text>
      </FancyButton>
    </View>
  );
}

function DatePick({onChange, removeDate, setRemove}) {
  const {colors} = useTheme();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    const dates =
      '\n' +
      (date.getMonth() + 1) +
      '/' +
      date.getDate() +
      '(' +
      CONST_VALUE.WEEK[date.getDay()] +
      ') ';
    setSelectedDate(selectedDate.concat(dates));
  };

  const resetDate = () => {
    setSelectedDate('');
  };

  useEffect(() => {
    onChange('dates', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (removeDate) {
      resetDate();
      setRemove(false);
    }
  });

  return (
    <View style={styles.datePick}>
      <View style={styles.dateButtonContainer}>
        <FancyButton
          icon="calendar-month"
          mode="outlined"
          color="#000069"
          onPress={showDatePicker}>
          <Text style={styles.text}>날짜추가</Text>
        </FancyButton>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

function AddFriend({onChange, showFriends}) {
  return (
    <View style={styles.addFriendButtonContainer}>
      <FancyButton
        icon="account-plus"
        mode="outlined"
        color="#000069"
        onPress={() => {
          showFriends();
        }}>
        <Text style={styles.text}>멤버추가</Text>
      </FancyButton>
    </View>
  );
}

function Friends({
  showFriendModal,
  hideFriends,
  onChange,
  peopleCount,
  friendInfo,
  friends,
  setFriends,
}) {
  const [add, setAdd] = useState([]);
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
                    onChange('peopleCount', peopleCount + 1);
                    setFriends((old) => [...old, friendId[0]]);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
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
                    onChange('peopleCount', peopleCount + 1);
                    setFriends((old) => [...old, friendId[1]]);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
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
                    onChange('peopleCount', peopleCount + 1);
                    setFriends((old) => [...old, friendId[2]]);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
                    setFriends(friends.filter((e) => e !== friendId[2]));
                  }
                  setIsAdd3(!isAdd3);
                }}
                value={friendName[2]}
                status={isAdd3 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>{friendName[2]}</Text>
            </View> */}
            {/* <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd4 === false) {
                    onChange('peopleCount', peopleCount + 1);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
                  }
                  setIsAdd4(!isAdd4);
                }}
                value="김준오"
                status={isAdd4 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>김준오</Text>
            </View>
            <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd5 === false) {
                    onChange('peopleCount', peopleCount + 1);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
                  }
                  setIsAdd5(!isAdd5);
                }}
                value="김정빈"
                status={isAdd5 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>김정빈</Text>
            </View>
            <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd6 === false) {
                    onChange('peopleCount', peopleCount + 1);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
                  }
                  setIsAdd6(!isAdd6);
                }}
                value="서재훈"
                status={isAdd6 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>서재훈</Text>
            </View> */}
          </Dialog.Content>
          <Dialog.Actions>
            <FancyButton mode="outlined" color="#000069" onPress={hideFriends}>
              완료
            </FancyButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

function ShortIntroduce({onChange}) {
  return (
    <View style={styles.shortIntroduceContainer}>
      <TextInput
        style={styles.shortIntroduceInput}
        label="한줄소개"
        placeholder="간략하게 소개해 주세요"
        mode="outlined"
        onChangeText={(value) => onChange('intro', value)}
      />
    </View>
  );
}

function PeopleCount({peopleCount, onChange}) {
  const numberGroup = ['1명', '2명', '3명', '4명', '5명'];
  return (
    <View style={styles.peopleCountButton}>
      <ButtonGroup
        buttons={numberGroup}
        onPress={(index) => onChange('peopleCount', index + 1)}
        selectedIndex={peopleCount - 1}
        selectedButtonStyle={{backgroundColor: 'red'}}
        containerStyle={{flex: 1}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    flexDirection: 'column',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleText: {
    fontSize: 36,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  formContainer: {
    flex: 5,
    flexDirection: 'column',
  },
  datePickContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePick: {
    flex: 1,
    width: width * 0.5,
  },
  datesTextContainer: {},
  dateButtonContainer: {
    flex: 1,
  },
  addFriednContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendButtonContainer: {
    flex: 1,
    width: width * 0.5,
    marginBottom: 20,
  },
  shortIntroduceContainer: {
    flex: 1,
  },
  shortIntroduceInput: {
    height: 40,
    width: width * 0.9,
    padding: 10,
  },
  peopleCountContainer: {
    flex: 1,
  },
  peopleCountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },

  friendInfoContainer: {
    flex: 3,
  },
  text: {
    fontFamily: FancyFonts.BMDOHYEON,
  },
  memberText: {
    fontFamily: FancyFonts.BMDOHYEON,
    marginTop: 8,
  },

  memberContainer: {
    flexDirection: 'row',
  },
  list: {
    height: 130,
    width: width * 0.8,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 2,
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
    fontSize: 12,
    padding: 15,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  dates: {
    fontSize: 12,
    padding: 10,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  completeContainer: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },
});
