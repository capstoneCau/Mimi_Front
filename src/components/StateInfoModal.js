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
import {getCompatibility} from '../modules/getInformation';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
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
  partyId,
}) {
  const [userStateInfo, setUserStateInfo] = useState([]);
  const [userListInfo, setUserListInfo] = useState([]);
  const [userMatchingSelectInfo, setUserMatchingSelectInfo] = useState([]);
  const [userMeetingInfo, setUserMeetingInfo] = useState([]);
  const [mbtiScore, setMbtiScore] = useState([]);
  const [starScore, setStarScore] = useState([]);
  const [zodiacScore, setZodiacScore] = useState([]);

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
      getCompatibility(token, 'mbti', 'room', roomId)
        .then((response) => response)
        .then((result) => {
          setMbtiScore(result);
        });
      getCompatibility(token, 'star', 'room', roomId)
        .then((response) => response)
        .then((result) => {
          setStarScore(result);
        });
      getCompatibility(token, 'zodiac', 'room', roomId)
        .then((response) => response)
        .then((result) => {
          setZodiacScore(result);
        });
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
      style={styles.acceptButton}
      mode="outlined"
      color="#000069"
      onPress={() => {
        _matchMeeting(partyId, token);
        hideModal();
      }}>
      <Text style={styles.text}>수락</Text>
    </FancyButton>
  );
  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <View style={styles.contentContainer}>
            <View style={styles.itemContainer}>
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
                      console.log('stateinfomodal');
                    }}>
                    <View
                      style={[
                        typeof item !== 'undefined'
                          ? roomState == 'S'
                            ? item.user.gender == 'male'
                              ? styles.contentM
                              : styles.contentF
                            : item.gender == 'male'
                            ? styles.contentM
                            : styles.contentF
                          : '',
                      ]}>
                      <View style={styles.leftContent}>
                        <View style={styles.infoContent}>
                          <Text style={[styles.text, styles.nameText]}>
                            {typeof item !== 'undefined'
                              ? roomState == 'S'
                                ? item.user.name
                                : item.name
                              : ''}
                          </Text>
                          <Text style={[styles.text, styles.schoolText]}>
                            {typeof item !== 'undefined'
                              ? roomState == 'S'
                                ? item.user.school.split('학교')[0]
                                : item.school.split('학교')[0]
                              : ''}
                          </Text>
                        </View>
                        <View style={styles.subContent}>
                          <View>
                            <Text style={[styles.text, styles.subText]}>
                              {typeof item !== 'undefined'
                                ? roomState == 'S'
                                  ? item.user.mbti
                                  : item.mbti
                                : ''}
                            </Text>
                            <Text style={[styles.text, styles.subText]}>
                              {typeof item !== 'undefined'
                                ? roomState == 'S'
                                  ? mbtiScore.map((score) => {
                                      if (
                                        score.user == item.user.kakao_auth_id
                                      ) {
                                        return score.compatibility;
                                      }
                                    })
                                  : mbtiScore.map((score) => {
                                      if (score.user == item.kakao_auth_id) {
                                        return score.compatibility;
                                      }
                                    })
                                : ''}
                            </Text>
                          </View>
                          <View>
                            <Text style={[styles.text, styles.subText]}>
                              {typeof item !== 'undefined'
                                ? roomState == 'S'
                                  ? item.user.star
                                  : item.star
                                : ''}
                            </Text>
                            <Text style={[styles.text, styles.subText]}>
                              {typeof item !== 'undefined'
                                ? roomState == 'S'
                                  ? starScore.map((score) => {
                                      if (
                                        score.user == item.user.kakao_auth_id
                                      ) {
                                        return score.compatibility;
                                      }
                                    })
                                  : starScore.map((score) => {
                                      if (score.user == item.kakao_auth_id) {
                                        return score.compatibility;
                                      }
                                    })
                                : ''}
                            </Text>
                          </View>
                          <View>
                            <Text style={[styles.text, styles.subText]}>
                              {typeof item !== 'undefined'
                                ? roomState == 'S'
                                  ? item.user.chinese_zodiac + '띠'
                                  : item.chinese_zodiac + '띠'
                                : ''}
                            </Text>
                            <Text style={[styles.text, styles.subText]}>
                              {typeof item !== 'undefined'
                                ? roomState == 'S'
                                  ? zodiacScore.map((score) => {
                                      if (
                                        score.user == item.user.kakao_auth_id
                                      ) {
                                        return score.compatibility;
                                      }
                                    })
                                  : zodiacScore.map((score) => {
                                      if (score.user == item.kakao_auth_id) {
                                        return score.compatibility;
                                      }
                                    })
                                : ''}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.rightContent}>
                        <Text style={[styles.text, styles.stateText]}>
                          {typeof item !== 'undefined'
                            ? roomState == 'S'
                              ? item.is_accepted === 'a'
                                ? '참가'
                                : '대기'
                              : null
                            : null}
                        </Text>
                      </View>
                    </View>

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
                  </TouchableOpacity>
                )}
                keyExtractor={(_item, index) => `${index}`}
              />
            </View>
            <View style={styles.buttonContainer}>
              <View
                style={[
                  roomStatus == 'a' &&
                  roomType == 'create' &&
                  userRole == 'invitee'
                    ? {display: 'none'}
                    : null,
                ]}>
                <Text style={[styles.text, styles.title]}>
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
                  <Text style={[styles.text]}>
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
                          hideModal();
                          _removeParticipate(partyId, token);
                        }
                      }
                    } else if (roomState === 'L') {
                      hideModal();
                      showFriends();
                    }
                  }}>
                  <Text style={[styles.text]}>
                    {roomState == 'S'
                      ? userRole == 'invitee'
                        ? '참여'
                        : '삭제'
                      : '참여'}
                  </Text>
                </FancyButton>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    width: width,
    height: height * 0.7,
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  itemContainer: {
    flex: 4,
  },
  personInfoContainer: {},
  contentM: {
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 2,
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#E8F5FF',
  },
  contentF: {
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 2,
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#FFDEE9',
  },
  leftContent: {
    flex: 5,
  },
  rightContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  infoContent: {
    flex: 4,
    flexDirection: 'row',
  },
  subContent: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1.3,
  },
  text: {
    fontFamily: FancyFonts.BMDOHYEON,
  },
  nameText: {
    fontSize: 25,
    marginRight: 20,
    marginBottom: 20,
  },
  schoolText: {
    fontSize: 20,
    marginTop: 4,
  },
  stateText: {
    fontSize: 25,
  },
  subText: {
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  acceptButton: {
    borderRadius: 10,
    borderWidth: 2,
    margin: 5,
    marginBottom: 10,
  },
});
