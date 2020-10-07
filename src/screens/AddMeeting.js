import React, {useState, useEffect} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {ButtonGroup, Button} from 'react-native-elements';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {CONST_VALUE} from '../common/common';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function AddMeeting({navigation}) {
  const [meetingInfo, setMeetingInfo] = useState({
    peopleCount: 4,
    dates: [],
    introduce: '',
  });
  const {peopleCount, dates, introduce} = meetingInfo;
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
      <View style={styles.myInfoContainer}>
        <View style={styles.datePickContainer}>
          <DatePick onChange={changeMeetingInfo} />
        </View>
        <View style={styles.shortIntroduceContainer}>
          <ShortIntroduce />
        </View>
      </View>
      <View style={styles.friendInfoContainer}>
        <View style={styles.peopleCountContainer}>
          <PeopleCount />
        </View>
        <Text>HI</Text>
      </View>
    </View>
  );
}

function DatePick({onChange}) {
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
      '월 ' +
      date.getDate() +
      '일 ' +
      CONST_VALUE.WEEK[date.getDay()] +
      '요일';
    setSelectedDate(selectedDate.concat(dates));
  };

  return (
    <View style={styles.datePick}>
      <View style={styles.datesTextContainer}>
        <Text style={styles.datesText}>{selectedDate}</Text>
      </View>
      <View style={styles.dateButtonContainer}>
        <TouchableOpacity onPress={showDatePicker}>
          <Text>날짜추가</Text>
        </TouchableOpacity>
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

function ShortIntroduce() {
  return (
    <View>
      <TextInput style={styles.shortIntroduceInput} placeholder="한줄소개" />
    </View>
  );
}

function PeopleCount() {
  const numberGroup = ['1명', '2명', '3명', '4명', '5명'];
  return (
    <View style={styles.peopleCountButton}>
      <ButtonGroup
        buttons={numberGroup}
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
    fontSize: 30,
  },
  myInfoContainer: {
    flex: 1,
  },
  datePickContainer: {
    flex: 1,
  },
  datePick: {
    flexDirection: 'row',
    width: width * 0.95,
    justifyContent: 'flex-end',
  },
  datesTextContainer: {
    flex: 6,
  },
  dateButtonContainer: {
    flex: 1,
  },
  shortIntroduceContainer: {
    flex: 1,
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
});
