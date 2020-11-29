import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useSelector, shallowEqual} from 'react-redux';
export default function Messages({route}) {
  const {thread} = route.params;
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
          displayName: user.displayName,
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
      <GiftedChat
        messages={messages}
        onSend={(newMessage) => handleSend(newMessage)}
        user={{
          _id: user.uid,
        }}
      />
    </>
  );
}
