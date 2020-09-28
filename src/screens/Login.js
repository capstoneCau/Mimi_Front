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
        <KakaoLoginBtn />
      </View>
      <View style={styles.next_container}>
        <Next navigation={navigation} />
      </View>
    </View>
  );
}

function Logo() {
  return <Image style={styles.logo} source={require('../image/logo.png')} />;
}

// 임시 Next Btn
function Next({navigation}) {
  return (
    <TouchableOpacity
      style={styles.nextBtn}
      onPress={() => {
        navigation.navigate('SignUp');
      }}>
      <Text style={styles.nextBtnText}>Next</Text>
    </TouchableOpacity>
  );
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
  next_container: {
    flex: 0.5,
    alignItems: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
  nextBtn: {
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 10,
  },
  nextBtnText: {
    fontSize: 20,
    padding: 3,
  },
});
