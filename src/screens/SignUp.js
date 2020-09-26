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
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <Text>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}
