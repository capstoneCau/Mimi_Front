import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Text, Portal, Dialog, RadioButton} from 'react-native-paper';

import {FancyButton, FancyFonts} from '../common/common';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Friends({
  showFriendModal,
  hideFriends,
  onChange,
  peopleCount,
  friendInfo,
  friends,
  setFriends,
}) {
  const [add, setAdd] = useState([]);
  const [isAdd1, setIsAdd1] = useState(false);
  const [isAdd2, setIsAdd2] = useState(false);
  const [isAdd3, setIsAdd3] = useState(false);
  const [isAdd4, setIsAdd4] = useState(false);
  const [isAdd5, setIsAdd5] = useState(false);
  const [isAdd6, setIsAdd6] = useState(false);
  let friendName = [];
  let friendId = [];
  friendInfo.forEach((val) => {
    friendName.push(val.to_user.name);
    friendId.push(val.to_user.kakao_auth_id);
  });

  return (
    <View>
      <Portal>
        <Dialog visible={showFriendModal} onDismiss={hideFriends}>
          <Dialog.Title style={styles.text}>멤버추가</Dialog.Title>
          <Dialog.Content>
            <View style={styles.memberContainer}>
              <RadioButton
                onPress={() => {
                  if (isAdd1 === false) {
                    onChange('peopleCount', peopleCount + 1);
                    setFriends((old) => [...old, friendId[0]]);
                  } else {
                    onChange('peopleCount', peopleCount - 1);
                    setFriends(friends.filter((e) => e !== friendId[0]));
                  }
                  /* 3항연산자로 하면 왜 안될까? */
                  setIsAdd1(!isAdd1);
                }}
                value={friendName[0]}
                status={isAdd1 ? 'checked' : 'unchecked'}
              />
              <Text style={styles.memberText}>{friendName[0]}</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <FancyButton mode="outlined" color="#000069" onPress={hideFriends}>
              완료
            </FancyButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FancyFonts.BMDOHYEON,
  },
  memberText: {
    fontFamily: FancyFonts.BMDOHYEON,
    marginTop: 8,
  },

  memberContainer: {
    flexDirection: 'row',
  },
});
