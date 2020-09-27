import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function KakaoLoginBtn() {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('HI');
      }}>
      <Image style={styles.kakaoBtn} source={require('../image/kakao.png')} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  kakaoBtn: {
    height: 48,
    width: 240,
  },
});
