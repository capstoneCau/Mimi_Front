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
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {CONST_VALUE} from '../common/common';

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
      <View style={styles.myInfoContainer}>
        <View style={styles.datePickContainer}>
          <DatePick onChange={changeMeetingInfo} />
        </View>
        <View style={styles.shortIntroduceContainer}>
          <ShortIntroduce onChange={changeMeetingInfo} />
        </View>
      </View>
      <View style={styles.friendInfoContainer}>
        <View style={styles.peopleCountContainer}>
          <PeopleCount peopleCount={peopleCount} onChange={changeMeetingInfo} />
        </View>
        <View style={styles.peopleContainer}>
          <People peopleCount={peopleCount} />
        </View>
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

function People({peopleCount}) {
  let line;
  let temp = [];
  if (peopleCount < 3) {
    line = styles.line1;
  } else if (peopleCount >= 3 && peopleCount < 5) {
    line = styles.line2;
  } else {
    line = styles.line3;
  }
  for (let i = 1; i <= peopleCount; i++) {
    temp.push(<Text>{i}</Text>);
  }
  return (
    <View style={styles.lineContainer}>
      <View style={line}>{temp}</View>
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
  peopleContainer: {
    flex: 1,
  },
  lineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line1: {
    flex: 1,
  },
  line2: {
    flex: 1,
  },
  line3: {
    flex: 1,
  },
});
