import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {FancyFonts, backAction} from '../common/common';

export default function State() {
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', backAction);

  //   return () =>
  //     BackHandler.removeEventListener('hardwareBackPress', backAction);
  // }, []);
  return (
    <View>
      <TouchableOpacity>
        <Text>정보</Text>
      </TouchableOpacity>
    </View>
  );
}
