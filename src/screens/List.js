import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const tempMyData = {
  kakaoAuthId: 123456789,
  name: '권현빈',
  gender: 'M',
  birthday: 960823,
  school: '중앙대학교',
  email: 'bini0823@cau.ac.kr',
  address: {
    latitude: 100,
    longitude: 100,
  },
  profileImg: '',
  mbti: 'ABCD',
};

const tempListData = [
  {
    peopleCount: 4,
    school: '중앙대',
    dates: ['10/1\n', '10/2\n', '10/3\n', '10/4\n'],
    intro: 'No pain No gain',
  },
  {
    peopleCount: 4,
    school: '성균관대',
    dates: ['10/1\n', '10/2\n'],
    intro: '성하예프 성하예프 성하예프',
  },
  {
    peopleCount: 4,
    school: '한양대',
    dates: ['10/1\n', '10/2\n'],
    intro: '맥주싫어요 소주좋아요',
  },
  {
    peopleCount: 4,
    school: '서울대',
    dates: ['10/1\n', '10/2\n'],
    intro: '소주좋아요 소주주세요',
  },
  {
    peopleCount: 4,
    school: '서강대',
    dates: ['10/1\n', '10/2\n'],
    intro: '술게임하고싶어요',
  },
  {
    peopleCount: 4,
    school: '고려대',
    dates: ['10/1\n', '10/2\n'],
    intro: '재밌어요',
  },
];

export default function List({navigation}) {
  const addBtn = () => {
    return (
      <TouchableOpacity
        style={[styles.list_container, styles.addBtn_container]}
        onPress={() => {
          navigation.navigate('AddMeeting');
        }}>
        <Text>Add</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tempListData}
        ListHeaderComponent={addBtn}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.list_container}
            onPress={() => {
              //navigation.navigate('미팅요청')
              console.log('press');
            }}>
            <View style={styles.list}>
              <Text style={styles.peopleCount}>{item.peopleCount}</Text>
              <View style={styles.content}>
                <Text style={styles.school}>{item.school}</Text>
                <Text style={styles.intro}>{item.intro}</Text>
              </View>
              <Text style={styles.dates}>{item.dates}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_item, index) => `${index}`}
      />
    </SafeAreaView>
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
  },
  content: {
    flex: 5,
    flexDirection: 'column',
  },
  school: {
    alignSelf: 'flex-start',
    fontSize: 30,
    padding: 10,
  },
  intro: {
    alignSelf: 'flex-start',
    fontSize: 17,
    padding: 15,
  },
  dates: {
    fontSize: 15,
    padding: 10,
  },
});
