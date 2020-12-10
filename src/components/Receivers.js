import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {StyleSheet, View, Dimensions, FlatList, Alert} from 'react-native';
import {Text, Portal, Dialog, Switch, RadioButton} from 'react-native-paper';

import {FancyButton, FancyFonts} from '../common/common';
import {useSelector, useDispatch} from 'react-redux';
import {changeIsSendMeetingMember} from '../modules/safeReturn';
import localToInfo from '../common/LocalToInfo';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Receivers({
  show,
  hide,
  friendInfo,
  setReceivers,
  notiReceiverIds,
  isSendMeetingMember,
}) {
  const [isAdd, setIsAdd] = useState(
    friendInfo.map((val) =>
      notiReceiverIds == null
        ? false
        : notiReceiverIds.indexOf(val.to_user.kakao_auth_id) != -1,
    ),
  );
  const [isSwitchOn, setIsSwitchOn] = useState(isSendMeetingMember);
  const dispatch = useDispatch();
  const _changeIsSendMeetingMember = useCallback(
    (_isSendMeetingMember) =>
      dispatch(changeIsSendMeetingMember(_isSendMeetingMember)),
    [dispatch],
  );

  return (
    <View>
      <Portal>
        <Dialog
          visible={show}
          onDismiss={() => {
            hide();
          }}>
          <View>
            <View style={styles.switchContainer}>
              <Text>미팅멤버On/Off</Text>
              <Switch
                style={styles.switch}
                color="#9370DB"
                value={isSwitchOn}
                onValueChange={setIsSwitchOn}
              />
            </View>
          </View>
          <Dialog.Title style={styles.text}>수신자추가</Dialog.Title>
          <Dialog.Content>
            <View style={styles.memberContainer}>
              <FlatList
                data={friendInfo}
                renderItem={({item, index}) => (
                  <View style={[styles.checkBox]}>
                    <RadioButton
                      value={item.to_user.name}
                      onPress={() => {
                        let newArray = [];
                        newArray = isAdd.map((val, idx) =>
                          idx === index ? !val : val,
                        );
                        console.log(newArray);
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
              disabled={isAdd.indexOf(true) == -1 && !isSwitchOn}
              mode="outlined"
              color="#000069"
              onPress={() => {
                hide();
                const ids = [];
                const names = [];
                isAdd.forEach((val, idx) => {
                  if (val) {
                    names.push(friendInfo[idx].to_user.name);
                    ids.push(friendInfo[idx].to_user.kakao_auth_id);
                  }
                });
                console.log(ids, names);
                setReceivers(ids, names);
                _changeIsSendMeetingMember(isSwitchOn);
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
  switchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  switch: {
    margin: 20,
  },
});
