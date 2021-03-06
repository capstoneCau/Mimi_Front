import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
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
  getInviterParticipateRequest,
  getInviteeParticipateRequest,
} from '../modules/requestInfo';
import {
  Provider,
  Appbar,
  Modal,
  Avatar,
  TextInput,
  Text,
  ToggleButton,
  Card,
  Title,
  Paragraph,
  Portal,
  Dialog,
  useTheme,
  RadioButton,
} from 'react-native-paper';
import {FancyFonts, backAction, FancyButton} from '../common/common';
import StateInfoModal from '../components/StateInfoModal';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default function State() {
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);
  const [visible, setVisible] = useState(false);
  const [restart, setRestart] = useState('false');
  const [requestNum, setRequestNum] = useState(0);
  const [roomNum, setRoomNum] = useState(0);
  const [roomType, setRoomType] = useState('');
  const [roomStatus, setRoomStatus] = useState('');
  const [userRole, setUserRole] = useState('');
  const [partyNum, setPartyNum] = useState('');
  const [toggle, setToggle] = useState('left');
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
  const getInviterParticipate = useCallback(
    (token) => dispatch(getInviterParticipateRequest(token)),
    [dispatch],
  );
  const getInviteeParticipate = useCallback(
    (token) => dispatch(getInviteeParticipateRequest(token)),
    [dispatch],
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    getInviterCreate(myInfo.token);
    getInviteeCreate(myInfo.token);
    getInviterParticipate(myInfo.token);
    getInviteeParticipate(myInfo.token);
  }, [restart]);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="내 미팅" />
        <Appbar.Action
          icon="autorenew"
          onPress={() => {
            setRestart(!restart);
          }}
        />
      </Appbar.Header>
      <ToggleButton.Row
        style={styles.toggleContainer}
        onValueChange={(value) => setToggle(value)}
        value={toggle}>
        <View style={styles.createToggle}>
          <ToggleButton
            size={40}
            disabled={toggle == 'left' ? true : false}
            icon="arrow-left-bold"
            value="left"
          />
          <Text style={styles.toggleText}>생성</Text>
        </View>
        <View style={styles.participateToggle}>
          <Text style={styles.toggleText}>참여</Text>
          <ToggleButton
            size={40}
            disabled={toggle == 'right' ? true : false}
            icon="arrow-right-bold"
            value="right"
          />
        </View>
      </ToggleButton.Row>
      <View style={[toggle == 'left' ? null : {display: 'none'}]}>
        <Text style={styles.title}>생성</Text>
        <FlatList
          data={roomInfo.inviterCreateList.concat(roomInfo.inviteeCreateList)}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[
                typeof item !== 'undefined'
                  ? item.room.status == 'w'
                    ? styles.list_container
                    : item.room.status == 'a'
                    ? styles.list_container_accepted
                    : {display: 'none'}
                  : {display: 'none'},
              ]}
              onPress={() => {
                if (item.user_role == 'invitee') {
                  setRoomType('create');
                  setRequestNum(item.id);
                  setRoomNum(item.room.id);
                  setRoomStatus(item.room.status);
                  setUserRole('invitee');
                  showModal();
                } else {
                  setRoomType('create');
                  setRequestNum(item.id);
                  setRoomNum(item.room.id);
                  setRoomStatus(item.room.status);
                  setUserRole('inviter');
                  showModal();
                  console.log('나는방장');
                }
              }}>
              <View style={styles.list}>
                <Text style={styles.peopleCount}>
                  {typeof item !== 'undefined' ? item.room.user_limit : ''}
                </Text>
                <View style={styles.content}>
                  <Text style={styles.school}>
                    {typeof item !== 'undefined' ? item.user.mbti : ''}
                  </Text>
                  <Text style={styles.intro}>
                    {typeof item !== 'undefined' ? item.room.introduction : ''}
                  </Text>
                </View>
                <Text style={styles.dates}>
                  {typeof item !== 'undefined'
                    ? item.room.available_dates.map(
                        (v) =>
                          v.split('-')[1] + '월' + v.split('-')[2] + '일\n',
                      )
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(_item, index) => `${index}`}
        />
      </View>
      <View style={[toggle == 'right' ? null : {display: 'none'}]}>
        <Text style={styles.title}>참여</Text>
        <FlatList
          data={roomInfo.inviterParticiatList.concat(
            roomInfo.inviteeParticiateList,
          )}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[
                typeof item !== 'undefined'
                  ? item.room.status == 'a'
                    ? styles.list_container
                    : {display: 'none'}
                  : {display: 'none'},
              ]}
              onPress={() => {
                if (item.user_role == 'invitee') {
                  setRoomType('participate');
                  setRequestNum(item.id);
                  setRoomNum(item.room.id);
                  setRoomStatus(item.room.status);
                  setUserRole('invitee');
                  showModal();
                } else {
                  setRoomType('participate');
                  setRequestNum(item.id);
                  setRoomNum(item.room.id);
                  setRoomStatus(item.room.status);
                  setUserRole('inviter');
                  setPartyNum(item.party_number);
                  showModal();
                  console.log('나는방장');
                }
              }}>
              <View style={styles.list}>
                <Text style={styles.peopleCount}>
                  {typeof item !== 'undefined' ? item.room.user_limit : ''}
                </Text>
                <View style={styles.content}>
                  <Text style={styles.school}>
                    {typeof item !== 'undefined'
                      ? item.room.meeting.map((v) => {
                          return v.mbti + '/';
                        })
                      : ''}
                  </Text>
                  <Text style={styles.intro}>
                    {typeof item !== 'undefined' ? item.room.introduction : ''}
                  </Text>
                </View>
                <Text style={styles.dates}>
                  {typeof item !== 'undefined'
                    ? item.room.available_dates.map(
                        (v) =>
                          v.split('-')[1] + '월' + v.split('-')[2] + '일\n',
                      )
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(_item, index) => `${index}`}
        />
      </View>
      <StateInfoModal
        visible={visible}
        hideModal={hideModal}
        token={myInfo.token}
        requestId={requestNum}
        roomId={roomNum}
        roomType={roomType}
        roomState="S"
        userRole={userRole}
        roomStatus={roomStatus}
        partyId={partyNum}
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
  toggleContainer: {
    alignSelf: 'center',
  },
  createToggle: {
    flexDirection: 'row',
    marginRight: 70,
  },
  participateToggle: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 70,
  },
  toggleText: {
    alignSelf: 'center',
    fontFamily: FancyFonts.BMDOHYEON,
  },

  list_container: {
    height: height / 6,
    width: width,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    borderBottomWidth: 0.2,
    backgroundColor: '#EBFFEB',
    marginTop: 3,
  },
  list_container_accepted: {
    height: height / 7,
    width: width,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    borderBottomWidth: 0.2,
    backgroundColor: '#dcdcdc',
    marginTop: 3,
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
    fontSize: 20,
    padding: 10,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  intro: {
    alignSelf: 'flex-start',
    fontSize: 17,
    padding: 15,
  },
  dates: {
    fontSize: 15,
    padding: 10,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  title: {
    fontSize: 25,
    fontFamily: FancyFonts.BMDOHYEON,
    textAlign: 'center',
    marginTop: 10,
  },
  containerStyle: {
    backgroundColor: 'white',
  },
});
