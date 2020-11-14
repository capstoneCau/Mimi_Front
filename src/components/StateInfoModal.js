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
import {getRequestUserInfo, updateRequest} from '../modules/requestInfo';
import {FancyButton, FancyFonts} from '../common/common';
import {getRoomInfo} from '../modules/meetingInfo';
const data = [
  {
    user: {
      kakao_auth_id: '1496391237',
      name: 'DD',
      gender: 'male',
      birthday: '1996-08-23',
      email: 'bini0823@cau.ac.kr',
      school: '중앙대학교서울캠퍼스',
      fcmToken:
        'eX30wTKST-u-DqIHRJaSwT:APA91bHnNduBKLng-x7oJGm0w-lEdsRb32KNWiHgSNkVzc7AUUPCOv_hA3dfEn0ZxC13dN8UsMgMg5_ShiScO2pzW2_nfx1480au82Cvijl-Kk7KUJ08wVakh3G4d8FV9h-HqQ_55zI1',
      profileImg: null,
      mbti: 'ISFJ',
      star: '처녀자리',
      chinese_zodiac: '쥐',
    },
    user_role: 'inviter',
  },
];

export default function StateInfoModal({
  visible,
  hideModal,
  token,
  requestId,
  roomType,
  roomState,
  showFriends,
}) {
  const [userInfo, setUserInfo] = useState([]);
  const dispatch = useDispatch();
  const getUserInfo = useCallback(
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
  useEffect(() => {
    if (roomState === 'S') {
      const sameGender = getUserInfo(requestId, token); // requestId = requestId
      setUserInfo(data);
    } else if (roomState === 'L') {
      const diffGender = _getRoomInfo(requestId, token); // requestId = roomNum
      setUserInfo(diffGender.meeting);
    }
  }, [requestId]);
  console.log(JSON.stringify(userInfo));

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <FlatList
            data={userInfo}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  console.log('press');
                }}>
                <View>
                  <Text>{item.user.name}</Text>
                  <Text>{item.user.school}</Text>
                  <Text>{item.user.mbti}</Text>
                  <Text>{item.user.star}</Text>
                  <Text>{item.user.chinese_zodiac}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(_item, index) => `${index}`}
          />
          <View>
            <FancyButton
              mode="outlined"
              color="#000069"
              onPress={() => {
                if (roomState === 'S') {
                  update(roomType, 'r', requestId, token);
                  hideModal();
                } else if (roomState === 'L') {
                  hideModal();
                }
              }}>
              <Text>아니오</Text>
            </FancyButton>
            <FancyButton
              mode="outlined"
              color="#000069"
              onPress={() => {
                if (roomState === 'S') {
                  update(roomType, 'a', requestId, token);
                  hideModal();
                } else if (roomState === 'L') {
                  hideModal();
                  showFriends();
                }
              }}>
              <Text>네</Text>
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
