import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Appbar} from 'react-native-paper';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useSelector, shallowEqual} from 'react-redux';
export default function Messages({route}) {
  const {thread, info} = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.login, shallowEqual);
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
          // avatar:
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

  return (
    <>
      {/* 상단 메뉴 필요함, 방 정보(상대방 프로필 리스트), 방 종료하기*/}
      <Appbar.Header>
        <Appbar.Content title={['그룹채팅  ', info.user_limit * 2]} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <GiftedChat
        renderUsernameOnMessage={true}
        messages={messages}
        onSend={(newMessage) => handleSend(newMessage)}
        user={{
          _id: user.uid,
          name: user.displayName,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 20,
  },
});
