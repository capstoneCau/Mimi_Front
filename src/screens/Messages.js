import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Appbar, Avatar, Button, ProgressBar, Colors} from 'react-native-paper';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {getParticipatedUserInfoList} from '../modules/meetingInfo';
import {getCompatibility} from '../modules/getInformation';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Messages({navigation, route}) {
  // const {thread, info} = route.params;
  const {thread, myImg} = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectUser, setSelectUser] = useState();
  const [memberInfo, setMemberInfo] = useState();
  const [userNum, setUserNum] = useState();
  const [mbtiList, setMbtiList] = useState();
  const [mbtiNum, setMbtiNum] = useState();
  const user = useSelector((state) => state.login, shallowEqual);
  const dispatch = useDispatch();
  const getUserInfoList = useCallback(
    (roomId, token) => dispatch(getParticipatedUserInfoList(roomId, token)),
    [dispatch],
  );
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    const unsubscribeListener = firestore()
      .collection('CHATINGS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const _messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName,
            };
          }

          return data;
        });

        setMessages(_messages);
        if (loading) {
          setLoading(false);
        }
      });

    return () => unsubscribeListener();
  }, []);
  const handleSend = async (newMessage) => {
    const text = newMessage[0].text;
    setMessages(GiftedChat.append(messages, newMessage));
    const docRef = await firestore()
      .collection('CHATINGS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: user.uid,
          displayName: user.userInfo.name,
          avatar: `data:image/jpeg;base64,${myImg}`,
        },
      });
    await firestore()
      .collection('CHATINGS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
  };
  if (loading) {
    return <ActivityIndicator size="large" color="#555" />;
  }

  const stateInfo = (_user) => {
    setUserNum(undefined);
    setMbtiNum(undefined);

    getUserInfoList(thread.roomId, user.token)
      .then((response) => response)
      .then((result) => {
        setMemberInfo(result);
        return result;
      })
      .then((result) => {
        result.forEach((val, idx) => {
          if (val.user.name == _user.displayName) {
            setUserNum(idx);
          }
          getCompatibility(user.token, 'mbti', 'room', thread.roomId)
            .then((response) => response)
            .then((res) => {
              setMbtiList(res);
              return res;
            })
            .then((res) => {
              res.forEach((mbtiVal, mbtiIdx) => {
                result.forEach((userVal) => {
                  // if (userVal.user.name == _user.displayName) {
                  if (mbtiVal.user == userVal.user.kakao_auth_id) {
                    setMbtiNum(mbtiVal.compatibility);
                  }
                  // }
                });
              });
            });
        });
      });

    showModal();
    setSelectUser(_user);
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'black',
          },
          left: {
            color: 'black',
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: '#FFD232',
          },
          left: {
            backgroundColor: 'white',
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* 상단 메뉴 필요함, 방 정보(상대방 프로필 리스트)*/}
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction
          onPress={() => {
            navigation.pop();
          }}
        />
        <Appbar.Content title={thread.name} />
        {/* <Appbar.Action icon="magnify" onPress={() => {}} /> */}
      </Appbar.Header>
      <GiftedChat
        renderUsernameOnMessage={true}
        renderAvatarOnTop={true}
        renderBubble={renderBubble}
        showUserAvatar={true}
        messages={messages}
        onSend={(newMessage) => handleSend(newMessage)}
        onPressAvatar={stateInfo}
        user={{
          _id: user.uid,
          name: user.displayName,
        }}
      />
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={visible}
        onDismiss={hideModal}>
        <View>
          {typeof selectUser == 'undefined' ? null : (
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.header} onPress={hideModal}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
              {typeof memberInfo == 'undefined' ? null : typeof userNum ==
                'undefined' ? null : (
                <View style={styles.introContainer}>
                  {/* <Text style={styles.introText}>
                    {memberInfo[userNum].user.chinese_zodiac}
                  </Text> */}
                  <Text style={styles.introText}>
                    {memberInfo[userNum].user.mbti}
                  </Text>
                  {typeof mbtiNum == 'undefined' ? null : (
                    <View style={styles.mbti}>
                      <Text style={styles.mbtiText}>{mbtiNum}</Text>
                      <ProgressBar
                        progress={mbtiNum}
                        color={Colors.yellow900}
                        style={styles.mbtiBar}
                      />
                    </View>
                  )}
                  <Text style={styles.introText}>
                    {memberInfo[userNum].user.school.split('학교')[0]}
                  </Text>
                </View>
              )}

              <View style={styles.introduce}>
                <Avatar.Image
                  size={240}
                  source={{uri: `${selectUser.avatar}`}}
                />
                <Text style={styles.text}>{selectUser.displayName}</Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9BC3FF',
  },
  appbar: {
    backgroundColor: '#9BC3FF',
  },

  name: {
    fontSize: 20,
  },
  modalContainer: {},
  header: {
    margin: 30,
  },
  introduce: {
    marginTop: height * 0.08,
    alignItems: 'center',
  },
  introContainer: {
    alignItems: 'center',
  },
  introText: {
    fontSize: 20,
  },
  text: {
    fontSize: 30,
    marginTop: 20,
  },
  closeButton: {
    fontSize: 30,
  },
  mbti: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mbtiText: {
    fontSize: 20,
  },
  mbtiBar: {
    width: 200,
    height: 50,
    margin: 20,
  },
});
