import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const tempData = [
  {
    school: ['중앙대학교1'],
    dates: ['10/1', '10/2'],
    place: '강남',
    peopleCount: 4,
  },
  {
    school: ['중앙대학교2'],
    dates: ['10/1', '10/2'],
    place: '강남',
    peopleCount: 4,
  },
  {
    school: ['중앙대학교3'],
    dates: ['10/1', '10/2'],
    place: '강남',
    peopleCount: 4,
  },
  {
    school: ['중앙대학교4'],
    dates: ['10/1', '10/2'],
    place: '강남',
    peopleCount: 4,
  },
  {
    school: ['중앙대학교5'],
    dates: ['10/1', '10/2'],
    place: '강남',
    peopleCount: 4,
  },
];

export default function List({navigation}) {
  const addBtn = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AddMeeting');
        }}>
        <Text>Add</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={tempData}
        ListHeaderComponent={addBtn}
        renderItem={({item, index}) => (
          <View>
            <Text>{item.school}</Text>
            <Text>{item.peopleCount}</Text>
            <Text>{item.place}</Text>
            <Text>{item.dates}</Text>
          </View>
        )}
        keyExtractor={(_item, index) => `${index}`}
      />
    </SafeAreaView>
  );
}
