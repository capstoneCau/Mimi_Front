import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function SignUp({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.textView,
          {opacity: fadeAnim},
          startSignUp ? {display: 'none'} : {},
        ]}>
        <Text style={styles.text1}>가입을 시작합니다!</Text>
        <Text style={styles.text2}>
          카카오계정 하나로 서비스를 이용할 수 있어요!
        </Text>
      </Animated.View>
      {signUp}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontSize: 30,
    marginBottom: 10,
  },
  text2: {
    fontFamily: 'Geogia',
  },
});