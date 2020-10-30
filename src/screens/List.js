import React, {useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {Appbar} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {FancyFonts, backAction} from '../common/common';
import {requestKaKaoAuthIdAsync} from '../modules/login';
import {myFriendList} from '../modules/myFriend';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const tempListData = [
  // {
  //   peopleCount: 4,
  //   school: '중앙대',
  //   dates: ['10/1\n', '10/2\n', '10/3\n', '10/4\n'],
  //   intro: '강남에서 4대4 미팅 하실분!',
  // },
  // {
  //   peopleCount: 4,
  //   school: '성균관대',
  //   dates: ['10/1\n', '10/2\n'],
  //   intro: '수원에서 미팅하실분 구해요~',
  // },
  // {
  //   peopleCount: 4,
  //   school: '한양대',
  //   dates: ['10/1\n', '10/2\n'],
  //   intro: '술게임 잘하시는 분 ㅠㅠ',
  // },
  // {
  //   peopleCount: 4,
  //   school: '서울대',
  //   dates: ['10/1\n', '10/2\n'],
  //   intro: '시간 겨우 내서 미팅합니당',
  // },
  // {
  //   peopleCount: 4,
  //   school: '서강대',
  //   dates: ['10/1\n', '10/2\n'],
  //   intro: '술게임하고싶어요',
  // },
  // {
  //   peopleCount: 4,
  //   school: '고려대',
  //   dates: ['10/1\n', '10/2\n'],
  //   intro: '놀고싶어요',
  // },
];

export default function List({navigation}) {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const getUser = useCallback(
    (kakaoId) => dispatch(requestKaKaoAuthIdAsync(kakaoId)),
    [dispatch],
  );
  const myFriend = useCallback((token) => dispatch(myFriendList(token)), [
    dispatch,
  ]);
  const myInfo = useSelector((state) => state.login);
  myFriend(myInfo.token);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const handleAdd = () => {
    navigation.navigate('AddMeeting');
  };

  const handleSearch = () => {
    console.log('Search!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="미팅목록" />
        <Appbar.Action icon="comment-search-outline" onPress={handleAdd} />
        <Appbar.Action icon="comment-plus-outline" onPress={handleAdd} />
      </Appbar.Header>
      <FlatList
        data={tempListData}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[styles.list_container, {backgroundColor: colors.card}]}
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
    fontFamily: FancyFonts.BMDOHYEON,
  },
  content: {
    flex: 5,
    flexDirection: 'column',
  },
  school: {
    alignSelf: 'flex-start',
    fontSize: 30,
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
});
