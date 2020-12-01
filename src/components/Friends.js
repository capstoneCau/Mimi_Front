import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {StyleSheet, View, Dimensions, FlatList} from 'react-native';
import {Text, Portal, Dialog, Switch, RadioButton} from 'react-native-paper';

import {FancyButton, FancyFonts} from '../common/common';
import State from '../screens/StateGive';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Friends({
  showFriendModal,
  hideFriends,
  onChange,
  friendsName,
  peopleCount,
  friendInfo,
  friends,
  setFriends,
  participateRoom,
  roomNum,
  token,
  type,
}) {
  let friendName = [];
  let friendId = [];
  let checkBoxArray = [];
  friendInfo.forEach((val) => {
    friendName.push(val.to_user.name);
    friendId.push(val.to_user.kakao_auth_id);
    checkBoxArray.push(false);
  });
  const [isEmpty, setIsEmpty] = useState(false);
  const [isAdd, setIsAdd] = useState(checkBoxArray);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    if (friends.length > 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [friends]);
  console.log(friendsName);
  return (
    <View>
      <Portal>
        <Dialog
          visible={showFriendModal}
          onDismiss={() => {
            hideFriends();
            setFriends([]);
            type == 'a' ? onChange('peopleCount', 1) : onChange([]);
          }}>
          {type == 's' ? (
            <Switch
              color="#9370DB"
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
          ) : null}
          <Dialog.Title style={styles.text}>
            {type == 's' ? '수신자추가' : '멤버추가'}
          </Dialog.Title>
          <Dialog.Content>
            <View style={styles.memberContainer}>
              <FlatList
                data={friendInfo}
                renderItem={({item, index}) => (
                  <View style={styles.checkBox}>
                    <RadioButton
                      value={item.to_user.name}
                      onPress={() => {
                        if (isAdd[index]) {
                          type == 'a'
                            ? onChange('peopleCount', peopleCount - 1)
                            : type == 's'
                            ? onChange(
                                friendsName.filter(
                                  (e) => e !== friendName[index],
                                ),
                              )
                            : null;
                          setFriends(
                            friends.filter((e) => e !== friendId[index]),
                          );
                        } else {
                          type == 'a'
                            ? onChange('peopleCount', peopleCount + 1)
                            : type == 's'
                            ? onChange((old) => [...old, friendName[index]])
                            : null;
                          setFriends((old) => [...old, friendId[index]]);
                        }
                        let newArray = [];
                        newArray = isAdd.map((val, idx) =>
                          idx === index ? !val : val,
                        );
                        setIsAdd(newArray);
                      }}
                      status={isAdd[index] ? 'checked' : 'unchecked'}
                    />
                    <Text style={styles.memberText}>{item.to_user.name}</Text>
                  </View>
                )}
                keyExtractor={(_item, index) => `${index}`}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <FancyButton
              disabled={!isEmpty}
              mode="outlined"
              color="#000069"
              onPress={() => {
                hideFriends();
                type == 'l' ? participateRoom(friends, roomNum, token) : null;
              }}>
              완료
            </FancyButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  checkBox: {
    flexDirection: 'row',
  },
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
