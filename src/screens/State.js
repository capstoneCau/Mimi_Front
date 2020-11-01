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
import {
  getInviterCreateRequest,
  getInviteeCreateRequest,
} from '../modules/requestInfo';
import {useTheme} from '@react-navigation/native';
import {FancyFonts, backAction} from '../common/common';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default function State() {
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);
  const dispatch = useDispatch();
  const myInfo = useSelector((state) => state.login);
  const roomInfo = useSelector((state) => state.requestInfo);
  const getInviterCreate = useCallback(
    (token) => dispatch(getInviterCreateRequest(token)),
    [dispatch],
  );
  const getInviteeCreate = useCallback(
    (token) => dispatch(getInviteeCreateRequest(token)),
    [dispatch],
  );
  useEffect(() => {
    getInviterCreate(myInfo.token);
    getInviteeCreate(myInfo.token);
  }, []);
  const {colors} = useTheme();

  console.log(roomInfo.inviterCreateList[0].room);
  return (
    <SafeAreaView style={styles.container}>
      <Text>내가만든방</Text>
      <FlatList
        data={roomInfo.inviterCreateList}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[styles.list_container, {backgroundColor: colors.card}]}
            onPress={() => {
              //navigation.navigate('미팅요청')
              console.log('press');
            }}>
            <View style={styles.list}>
              <Text style={styles.peopleCount}>{item.room.user_limit}</Text>
              <View style={styles.content}>
                <Text style={styles.school}>{item.user.mbti}</Text>
                <Text style={styles.intro}>{item.room.introduction}</Text>
              </View>
              <Text style={styles.dates}>
                {item.room.available_dates.map(
                  (v) => v.split('-')[1] + '월' + v.split('-')[2] + '일\n',
                )}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_item, index) => `${index}`}
      />
      <Text>친구가만든방</Text>
      <FlatList
        data={roomInfo.inviteeCreateList}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[styles.list_container, {backgroundColor: colors.card}]}
            onPress={() => {
              //navigation.navigate('미팅요청')
              console.log('press');
            }}>
            <View style={styles.list}>
              <Text style={styles.peopleCount}>{item.room.user_limit}</Text>
              <View style={styles.content}>
                <Text style={styles.school}>{item.user.mbti}</Text>
                <Text style={styles.intro}>{item.room.introduction}</Text>
              </View>
              <Text style={styles.dates}>
                {item.room.available_dates.map(
                  (v) => v.split('-')[1] + '월' + v.split('-')[2] + '일\n',
                )}
              </Text>
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
