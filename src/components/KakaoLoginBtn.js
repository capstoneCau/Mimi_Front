import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import {backAction} from '../common/common';
import KakaoLogins from '@react-native-seoul/kakao-login';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {requestKaKaoAuthIdAsync} from '../modules/login';

export default function KakaoLoginBtn({navigation}) {
  const [profile, setProfile] = useState(PROFILE_EMPTY);
  const user = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const onLoginUser = useCallback(
    (kakaoId, fcmToken) => dispatch(requestKaKaoAuthIdAsync(kakaoId, fcmToken)),
    [dispatch],
  );

  const logCallback = (log, callback) => {
    console.log(log);
    callback;
  };

  const TOKEN_EMPTY = 'token has not fetched';
  const PROFILE_EMPTY = {
    id: 'profile has not fetched',
    email: 'profile has not fetched',
    profile_image_url: '',
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);
  const kakaoLogin = async () => {
    logCallback('Login Start');
    try {
      const result = await KakaoLogins.login();
      logCallback(`Login Finished:${JSON.stringify(result)}`);

      const profile = await KakaoLogins.getProfile();

      setProfile(profile);
      logCallback(`Get Profile Finished:${JSON.stringify(profile)}`);

      if (await onLoginUser(profile.id, user.fcmToken)) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('SignUp', {
          // gender:
          //   profile.gender != null ? profile.gender.toLowerCase() : 'male',
          // birthday: profile.birthday,
          gender: 'male',
          birthday: '0522',
        });
        // console.log('a');
      }
    } catch (err) {
      if (err.code === 'E_CANCELLED_OPERATION') {
        logCallback(`Login Cancelled:${err.message}`);
      } else {
        logCallback(`Login Failed:${err.code} ${err.message}`);
      }
      console.log(err);
    }
  };

  const kakaoLogout = async () => {
    logCallback('Logout Start');
    try {
      const result = await KakaoLogins.logout();
      setProfile(PROFILE_EMPTY);
    } catch (err) {
      logCallback(`Logout Failed:${err.code} ${err.message}`);
    }
  };

  return (
    <TouchableOpacity
      // onPress={ !isLogin ? kakaoLogin : kakaoLogout}>
      onPress={kakaoLogin}>
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
