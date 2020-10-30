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
import {myFriendList} from '../modules/myFriend';
import {
  CONST_VALUE,
  FancyButton,
  FancyFonts,
  backAction,
} from '../common/common';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function AddMeeting({navigation}) {
  const dispatch = useDispatch();
  const getUser = useCallback(
    (kakaoId) => dispatch(requestKaKaoAuthIdAsync(kakaoId)),
    [dispatch],
  );
  const myFriend = useCallback((token) => dispatch(myFriendList(token)), [
    dispatch,
  ]);
  const _myInfo = useSelector((state) => state.login);
  const _friendInfo = useSelector((state) => state.myFriend);
  console.log(JSON.stringify(_friendInfo.myFriend[0].to_user));

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
  const {peopleCount, school, dates, intro} = meetingInfo;
  const [showFriendModal, setShowFriendModal] = useState(false);
  const changeMeetingInfo = (name, value) => {
    setMeetingInfo({
      ...meetingInfo,
      [name]: value,
    });
  };

  const showFriends = () => {
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
        />
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>새로운 미팅</Text>
      </View>
      <View style={styles.addFriednContainer}>
        <View style={styles.list}>
          <Text style={styles.peopleCount}>{peopleCount}</Text>
          <View style={styles.content}>
            <Text style={styles.school}>{myInfo.school}</Text>
            <Text style={styles.intro}>{intro}</Text>
          </View>
          <Text style={styles.dates}>{dates}</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.datePickContainer}>
          <DatePick onChange={changeMeetingInfo} />
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
              '권현빈,이종아,전승민에게 참가요청 메세지를 보냅니다.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
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

function DatePick({onChange}) {
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
      date.getMonth() +
      1 +
      '/' +
      date.getDate() +
      '(' +
      CONST_VALUE.WEEK[date.getDay()] +
      ') ' +
      '\n';
    setSelectedDate(selectedDate.concat(dates));
  };

  const resetDate = () => {
    setSelectedDate('');
  };

  useEffect(() => {
    onChange('dates', selectedDate);
  }, [selectedDate]);

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

function Friends({showFriendModal, hideFriends, onChange, peopleCount}) {
  const [friends, setFriends] = useState([]);
  const [isAdd1, setIsAdd1] = useState(false);
  const [isAdd2, setIsAdd2] = useState(false);
  const [isAdd3, setIsAdd3] = useState(false);
  const [isAdd4, setIsAdd4] = useState(false);
  const [isAdd5, setIsAdd5] = useState(false);
  const [isAdd6, setIsAdd6] = useState(false);

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
                  } else {
                    onChange('peopleCount', peopleCount - 1);
                  }
                  /* 3항연산자로 하면 왜 안될까? */
                  setIsAdd1(!isAdd1);
                }}
                value="권현빈"
                status={isAdd1 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>권현빈</Text>
            </View>
            <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd2 === false) {
                    onChange('peopleCount', peopleCount + 1);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
                  }
                  setIsAdd2(!isAdd2);
                }}
                value="이종아"
                status={isAdd2 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>이종아</Text>
            </View>
            <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd3 === false) {
                    onChange('peopleCount', peopleCount + 1);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
                  }
                  setIsAdd3(!isAdd3);
                }}
                value="전승민"
                status={isAdd3 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>전승민</Text>
            </View>
            <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd4 === false) {
                    onChange('peopleCount', peopleCount + 1);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
                  }
                  setIsAdd4(!isAdd4);
                }}
                value="서영운"
                status={isAdd4 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>서영운</Text>
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
                  setIsAdd5(!isAdd6);
                }}
                value="김정빈"
                status={isAdd6 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>김준오</Text>
            </View>
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
    fontSize: 25,
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
