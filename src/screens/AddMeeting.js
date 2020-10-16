import React, {useState, useEffect} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ButtonGroup} from 'react-native-elements';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  useTheme,
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
  const changeMeetingInfo = (name, value) => {
    setMeetingInfo({
      ...meetingInfo,
      [name]: value,
    });
  };

  return (
    <View style={styles.continer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>새로운 미팅</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.datePickContainer}>
          <DatePick onChange={changeMeetingInfo} />
        </View>
        <View style={styles.addFriednContainer}>
          <AddFriend onChange={changeMeetingInfo} />
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

function AddFriend({onChange}) {
  return (
    <View style={styles.addFriendButtonContainer}>
      <FancyButton icon="account-plus" mode="outlined" color="#000069">
        <Text>멤버추가</Text>
      </FancyButton>
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
  peopleContainer: {
    flex: 1,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },
});
