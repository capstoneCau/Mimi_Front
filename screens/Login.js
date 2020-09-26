import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default function Login({navigation}) {
  return (
    <View>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignUp');
          }}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
