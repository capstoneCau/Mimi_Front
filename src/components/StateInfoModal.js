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
  removeParticipate,
  getMatchingSelectInfo,
  matchMeeting,
} from '../modules/requestInfo';
import {FancyButton, FancyFonts} from '../common/common';
import {getRoomInfo, getParticipatedUserInfoList} from '../modules/meetingInfo';

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
  roomStatus,
}) {
  const [userStateInfo, setUserStateInfo] = useState([]);
  const [userListInfo, setUserListInfo] = useState([]);
  const [userMatchingSelectInfo, setUserMatchingSelectInfo] = useState([]);
  const [userMeetingInfo, setUserMeetingInfo] = useState([]);
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
  const _removeParticipate = useCallback(
    (_partyId, _token) => dispatch(removeParticipate(_partyId, _token)),
    [dispatch],
  );
  const _getMatchingSelectInfo = useCallback(
    (_requestId, _token) => dispatch(getMatchingSelectInfo(_requestId, _token)),
    [dispatch],
  );
  const _matchMeeting = useCallback(
    (_partyId, _token) => dispatch(matchMeeting(_partyId, _token)),
    [dispatch],
  );
  const _getMeetingUserInfo = useCallback(
    (_roomId, _token) => dispatch(getParticipatedUserInfoList(_roomId, _token)),
    [dispatch],
  );

  useEffect(() => {
    if (visible === true) {
      if (roomState === 'S' && roomStatus !== '') {
        const setStateUserInfo = async () => {
          const stateUserInfo = await _getUserInfo(requestId, token);
          setUserStateInfo(stateUserInfo);
        };
        setStateUserInfo();
      } else if (roomState === 'L' && roomStatus !== '') {
        const setListUserInfo = async () => {
          const listUserInfo = await _getRoomInfo(roomId, token);
          setUserListInfo(listUserInfo[0].meeting);
        };
        setListUserInfo();
      }
      if (roomStatus === 'a' && roomType === 'create') {
        const setMatcingSelectInfo = async () => {
          const matchingSelectInfo = await _getMatchingSelectInfo(
            requestId,
            token,
          );
          setUserMatchingSelectInfo(matchingSelectInfo);
        };
        setMatcingSelectInfo();
      }
      if (
        roomState === 'S' &&
        roomType === 'participate' &&
        roomStatus === 'a'
      ) {
        const getMeetingUserInfo = async () => {
          const meetingUserInfo = await _getMeetingUserInfo(roomId, token);
          setUserMeetingInfo(meetingUserInfo);
        };
        getMeetingUserInfo();
      }
    }
    return () => {};
  }, [visible]);

  const acceptButton = (partyId) => (
    <FancyButton
      mode="outlined"
      color="#000069"
      onPress={() => {
        _matchMeeting(partyId, token);
        hideModal();
      }}>
      <Text>수락</Text>
    </FancyButton>
  );
  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <FlatList
            data={
              roomState == 'S'
                ? roomStatus == 'a'
                  ? roomType == 'create'
                    ? userMatchingSelectInfo
                    : userStateInfo.concat(userMeetingInfo)
                  : userStateInfo
                : userListInfo
            }
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  console.log('press');
                }}>
                <View>
                  <Text>
                    {typeof item !== 'undefined'
                      ? roomState == 'S'
                        ? item.user.name
                        : item.name
                      : ''}
                  </Text>
                  <Text>
                    {typeof item !== 'undefined'
                      ? roomState == 'S'
                        ? item.user.school
                        : item.school
                      : ''}
                  </Text>
                  <Text>
                    {typeof item !== 'undefined'
                      ? roomState == 'S'
                        ? item.user.mbti
                        : item.mbti
                      : ''}
                  </Text>
                  <Text>
                    {typeof item !== 'undefined'
                      ? roomState == 'S'
                        ? item.user.star
                        : item.star
                      : ''}
                  </Text>
                  <Text>
                    {typeof item !== 'undefined'
                      ? roomState == 'S'
                        ? item.user.chinese_zodiac
                        : item.chinese_zodiac
                      : ''}
                  </Text>
                  {typeof userMatchingSelectInfo !== 'undefined'
                    ? roomType == 'create' &&
                      userRole == 'inviter' &&
                      roomStatus == 'a'
                      ? userMatchingSelectInfo.length > 1
                        ? userMatchingSelectInfo.length == index + 1
                          ? acceptButton(item.party_number)
                          : userMatchingSelectInfo[index].party_number !==
                            userMatchingSelectInfo[index + 1].party_number
                          ? acceptButton(item.party_number)
                          : null
                        : null
                      : null
                    : null}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(_item, index) => `${index}`}
          />
          <View
            style={[
              roomStatus == 'a' && roomType == 'create' && userRole == 'invitee'
                ? {display: 'none'}
                : null,
            ]}>
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
                    hideModal();
                    update(roomType, 'r', requestId, token);
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
                    hideModal();
                    update(roomType, 'a', requestId, token);
                  } else {
                    hideModal();
                    if (roomType == 'create') {
                      _removeMeeting(roomId, token);
                    } else {
                      // _removeParticipate(,token)
                    }
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
