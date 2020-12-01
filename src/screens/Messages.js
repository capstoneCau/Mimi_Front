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
          avatar:
            user.userInfo.name === '권현빈'
              ? 'data:image/jpeg;base64,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'
              : 'data:image/jpeg;base64,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',
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
        showUserAvatar={true}
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
