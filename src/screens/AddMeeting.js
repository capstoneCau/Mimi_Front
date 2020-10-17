import React, {useState, useEffect} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ButtonGroup} from 'react-native-elements';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Avatar,
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
import {CONST_VALUE, FancyButton, FancyFonts} from '../common/common';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function AddMeeting({navigation}) {
  const [meetingInfo, setMeetingInfo] = useState({
    peopleCount: 4,
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
        <Friends showFriendModal={showFriendModal} hideFriends={hideFriends} />
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>새로운 미팅</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.datePickContainer}>
          <DatePick onChange={changeMeetingInfo} />
        </View>
        <View style={styles.addFriednContainer}>
          <AddFriend onChange={changeMeetingInfo} showFriends={showFriends} />
        </View>
        {/* <View style={styles.shortIntroduceContainer}>
          <ShortIntroduce onChange={changeMeetingInfo} />
        </View> */}
      </View>
      <View style={styles.completeContainer}>
        <FancyButton icon="arrow-right-bold" mode="outlined" color="#000069">
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
      ') ';
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
          <Text>날짜추가</Text>
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
          console.log('HO');
        }}>
        <Text>멤버추가</Text>
      </FancyButton>
    </View>
  );
}

function Friends({showFriendModal, hideFriends}) {
  const [friends, setFriends] = useState([]);
  const [isAdd1, setIsAdd1] = useState(false);
  const [isAdd2, setIsAdd2] = useState(false);
  const [isAdd3, setIsAdd3] = useState(false);

  return (
    <View>
      <Portal>
        <Dialog visible={showFriendModal} onDismiss={hideFriends}>
          <Dialog.Title style={styles.text}>멤버추가</Dialog.Title>
          <Dialog.Content>
            <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
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
                  setIsAdd3(!isAdd3);
                }}
                value="전승민"
                status={isAdd3 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>전승민</Text>
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
    <View>
      <TextInput
        style={styles.shortIntroduceInput}
        placeholder="한줄소개"
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
    flex: 2,
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
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendButtonContainer: {
    width: width * 0.5,
  },
  shortIntroduceContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortIntroduceInput: {
    height: 40,
    width: width * 0.9,
    borderColor: 'gray',
    borderWidth: 1,
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
  completeContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },
});
