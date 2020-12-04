import React, {useState, useEffect, useCallback} from 'react';

import {
  View,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  FAB,
  Portal,
  Provider,
  Appbar,
  List,
  Colors,
  Avatar,
  Divider,
} from 'react-native-paper';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {FancyButton, FancyFonts} from '../common/common';
import {getInformation} from '../modules/getInformation';
import {myFriendList} from '../modules/myFriend';
import infoToLocal from '../common/InfoToLocal';
import localToInfo from '../common/LocalToInfo';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Friend({navigation}) {
  const [fabState, setFabState] = useState({open: false});
  const [profileMyImg, setProfileMyImg] = useState();
  const [kakaoIdArray, setKaKaoIdArray] = useState([]);
  const myInfo = useSelector((state) => state.login, shallowEqual);
  const friendInfo = useSelector((state) => state.myFriend);
  const dispatch = useDispatch();
  const getMyFriend = useCallback((token) => dispatch(myFriendList(token)), [
    dispatch,
  ]);

  useEffect(() => {
    getInformation(myInfo.token, 'profile')
      .then((response) => response)
      .then((result) => {
        setProfileMyImg(result.image);
      });
  }, []);
  console.log(kakaoIdArray);
  useEffect(() => {
    getMyFriend(myInfo.token);
    getInformation(myInfo.token);
  }, []);

  const friendList = friendInfo.myFriend.map((item, idx) => {
    return (
      <List.Item
        title={item.to_user.name}
        left={() => (
          <Avatar.Image
            size={45}
            source={{uri: `data:image/jpeg;base64,${profileMyImg}`}}
          />
        )}
      />
    );
  });

  const onStateChange = ({open}) => setFabState({open});
  const {open} = fabState;
  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="친구" />
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

        {friendList}
      </List.Section>
      <Provider>
        <Portal>
          <FAB.Group
            open={open}
            icon={open ? 'account-group' : 'plus'}
            actions={[
              {
                icon: 'minus',
                label: 'Remove',
                onPress: () => console.log('Pressed email'),
              },
              {
                icon: 'plus',
                label: 'Add',
                onPress: () => console.log('Pressed star'),
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
});
