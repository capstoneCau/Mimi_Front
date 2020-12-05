import React, {useState, useEffect, useCallback} from 'react';

import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
} from 'react-native';
import {
  Avatar,
  FAB,
  TextInput,
  Portal,
  Provider,
  Appbar,
  List,
  Colors,
  Divider,
  Button,
} from 'react-native-paper';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {FancyButton, FancyFonts} from '../common/common';
import {getInformation} from '../modules/getInformation';
import {myFriendList, addFriend} from '../modules/myFriend';
import infoToLocal from '../common/InfoToLocal';
import localToInfo from '../common/LocalToInfo';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Friend({navigation}) {
  const [fabState, setFabState] = useState({open: false});
  const [profileMyImg, setProfileMyImg] = useState();
  const [kakaoIdArray, setKaKaoIdArray] = useState([]);
  const [friendImage, setFriendImage] = useState([]);
  const [restart, setRestart] = useState(false);
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [modalText, setModalText] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const myInfo = useSelector((state) => state.login, shallowEqual);
  const friendInfo = useSelector((state) => state.myFriend);
  const dispatch = useDispatch();
  const getMyFriend = useCallback((token) => dispatch(myFriendList(token)), [
    dispatch,
  ]);

  const addFriends = useCallback(
    (token, userId, type) => dispatch(addFriend(token, userId, type)),
    [dispatch],
  );

  const showAddModal = () => setVisibleAddModal(true);
  const hideAddModal = () => setVisibleAddModal(false);

  useEffect(() => {
    getInformation(myInfo.token, 'profile')
      .then((response) => response)
      .then((result) => {
        setProfileMyImg(result.image);
      });
  }, []);

  let kakaoArray = [];
  useEffect(() => {
    getMyFriend(myInfo.token)
      .then((response) => response)
      .then((result) => {
        friendInfo.myFriend.forEach((item, val) => {
          kakaoArray.push(item.to_user.kakao_auth_id);
        });
        return kakaoArray;
      })
      .then((result) => {
        setKaKaoIdArray(result);
        return result;
      })
      .then((result) => {
        getInformation(myInfo.token, 'profile', 'users', result)
          .then((response) => response)
          .then((res) => {
            setFriendImage(res);
          });
      });
  }, [isAdd]);

  const friendList = friendInfo.myFriend.map((item, idx) => {
    return friendImage.map((friend, friendId) => {
      if (item.to_user.kakao_auth_id == friend.user) {
        return (
          <List.Item
            key={idx}
            title={item.to_user.name}
            left={() => (
              <Avatar.Image
                size={45}
                source={{uri: `data:image/jpeg;base64,${friend.image}`}}
              />
            )}
          />
        );
      }
    });
  });

  const onStateChange = ({open}) => setFabState({open});
  const {open} = fabState;
  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="친구" />
        <Appbar.Action icon="autorenew" onPress={() => {}} />
      </Appbar.Header>
      <List.Section>
        <List.Item
          title={myInfo.userInfo.name}
          left={() => (
            <Avatar.Image
              size={60}
              source={{uri: `data:image/jpeg;base64,${profileMyImg}`}}
            />
          )}
        />
      </List.Section>
      <Divider />
      <List.Section>
        <List.Subheader>친구</List.Subheader>

        {typeof friendInfo == 'undefined'
          ? null
          : typeof friendImage == 'undefined'
          ? null
          : friendList}
      </List.Section>
      <Provider>
        <Portal>
          <FAB.Group
            open={open}
            icon={open ? 'account-group' : 'plus'}
            actions={[
              // {
              //   icon: 'minus',
              //   label: 'Remove',
              //   onPress: () => console.log('Pressed email'),
              // },
              {
                icon: 'plus',
                label: 'Add',
                onPress: () => {
                  showAddModal();
                },
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </Provider>
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={visibleAddModal}
        onDismiss={hideAddModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.header} onPress={hideAddModal}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>카카오톡 코드로 추가</Text>
            <TouchableOpacity
              disabled={modalText.length == 10 ? false : true}
              onPress={() => {
                addFriends(myInfo.token, modalText, 'f');
                setIsAdd(!isAdd);
                hideAddModal();
              }}
              style={styles.modalButton}>
              <Text
                style={[
                  modalText.length == 10
                    ? styles.buttonText
                    : styles.buttonDisabled,
                ]}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            mode="outlined"
            maxLength={10}
            style={styles.inputModal}
            underlineColor="#a0a0a0"
            selectionColor="#a0a0a0"
            placeholder="친구 카카오톡 CODE (10자리)"
            value={modalText}
            onChangeText={(text) => setModalText(text)}
          />
          <View style={styles.explainModal}>
            <Text style={styles.explainText}>내 CODE</Text>
            <Text style={styles.explainCode}>
              {myInfo.userInfo.kakao_auth_id}
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    alignItems: 'center',

    flexDirection: 'row',
  },
  header: {
    margin: 30,
  },
  closeButton: {
    fontSize: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButton: {
    position: 'absolute',
    right: 0,
    marginRight: 20,
  },
  buttonDisabled: {
    fontSize: 13,
    color: '#969696',
  },
  buttonText: {
    fontSize: 15,
    color: '#282828',
  },
  inputModal: {
    margin: 10,
  },
  explainModal: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#dcdcdc',
  },
  explainText: {
    fontSize: 18,
    margin: 5,
  },
  explainCode: {
    fontSize: 18,
    position: 'absolute',
    right: 0,
    margin: 5,
  },
});
