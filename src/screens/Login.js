import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import KakaoLoginBtn from '../components/KakaoLoginBtn';

export default function Login({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.logo_container}>
        <Logo />
      </View>
      <View style={styles.login_container}>
        <KakaoLoginBtn navigation={navigation} />
      </View>
    </View>
  );
}

function Logo() {
  return <Image style={styles.logo} source={require('../image/logo.png')} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  background_container: {
    flex: 1,
    position: 'relative',
    resizeMode: 'cover',
  },
  logo_container: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 320,
    width: 380,
  },
  login_container: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
