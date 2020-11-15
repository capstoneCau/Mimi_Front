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
import {Modal, Portal, Text, Button, Provider} from 'react-native-paper';
import {
  getRequestUserInfo,
  updateRequest,
  removeMeeting,
} from '../modules/requestInfo';
import {FancyButton, FancyFonts} from '../common/common';
import {getRoomInfo} from '../modules/meetingInfo';

export default function StateInfoModal({
  visible,
  hideModal,
  token,
  requestId,
  roomId,
  roomType,
  roomState,
  showFriends,
  userRole,
}) {
  const [userStateInfo, setUserStateInfo] = useState([]);
  const [userListInfo, setUserListInfo] = useState([]);
  const dispatch = useDispatch();
  const _getUserInfo = useCallback(
    (_requestId, _token) => dispatch(getRequestUserInfo(_requestId, _token)),
    [dispatch],
  );
  const _getRoomInfo = useCallback(
    (_roomId, _token) => dispatch(getRoomInfo(_roomId, _token)),
    [dispatch],
  );
  const update = useCallback(
    (type, isAccepted, _requestId, _token) =>
      dispatch(updateRequest(type, isAccepted, _requestId, _token)),
    [dispatch],
  );
  const _removeMeeting = useCallback(
    (_roomId, _token) => dispatch(removeMeeting(_roomId, _token)),
    [dispatch],
  );

  useEffect(() => {
    if (roomState === 'S') {
      const setStateUserInfo = async () => {
        const stateUserInfo = await _getUserInfo(requestId, token);
        setUserStateInfo([stateUserInfo[0].user]); // 넣는 방식 여러명일때 바꿔줘야함
      };
      setStateUserInfo();
    } else if (roomState === 'L') {
      const setListUserInfo = async () => {
        const listUserInfo = await _getRoomInfo(roomId, token);
        setUserListInfo(listUserInfo[0].meeting);
      };
      setListUserInfo();
    }
    return () => {};
  }, [visible]);

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <FlatList
            data={roomState == 'S' ? userStateInfo : userListInfo}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  console.log('press');
                }}>
                <View>
                  <Text>{typeof item !== 'undefined' ? item.name : ''}</Text>
                  <Text>{typeof item !== 'undefined' ? item.school : ''}</Text>
                  <Text>{typeof item !== 'undefined' ? item.mbti : ''}</Text>
                  <Text>{typeof item !== 'undefined' ? item.star : ''}</Text>
                  <Text>
                    {typeof item !== 'undefined' ? item.chinese_zodiac : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(_item, index) => `${index}`}
          />
          <View>
            <Text>
              {roomState == 'S'
                ? userRole == 'invitee'
                  ? '참여하시겠습니까?'
                  : '삭제하시겠습니까?'
                : '참여하시겠습니까?'}
            </Text>
            <FancyButton
              mode="outlined"
              color="#000069"
              onPress={() => {
                if (roomState === 'S') {
                  if (userRole == 'invitee') {
                    update(roomType, 'r', requestId, token);
                    hideModal();
                  } else {
                    hideModal();
                  }
                } else if (roomState === 'L') {
                  hideModal();
                }
              }}>
              <Text>
                {roomState == 'S'
                  ? userRole == 'invitee'
                    ? '아니오'
                    : '아니오'
                  : '아니오'}
              </Text>
            </FancyButton>
            <FancyButton
              mode="outlined"
              color="#000069"
              onPress={() => {
                if (roomState === 'S') {
                  if (userRole == 'invitee') {
                    update(roomType, 'a', requestId, token);
                    hideModal();
                  } else {
                    _removeMeeting(roomId, token);
                    hideModal();
                  }
                } else if (roomState === 'L') {
                  hideModal();
                  showFriends();
                }
              }}>
              <Text>
                {roomState == 'S'
                  ? userRole == 'invitee'
                    ? '참여'
                    : '삭제'
                  : '참여'}
              </Text>
            </FancyButton>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: 500,
    height: 500,
    backgroundColor: 'white',
    padding: 20,
  },
});
