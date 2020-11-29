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
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  // const [unlinkLoading, setUnlinkLoading] = useState(false);
  const [token, setToken] = useState(TOKEN_EMPTY);
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
    logCallback('Login Start', setLoginLoading(true));
    try {
      const result = await KakaoLogins.login();
      setToken(result.accessToken);
      logCallback(
        `Login Finished:${JSON.stringify(result)}`,
        setLoginLoading(false),
      );

      const profile = await KakaoLogins.getProfile();

      setProfile(profile);
      logCallback(
        `Get Profile Finished:${JSON.stringify(profile)}`,
        setProfileLoading(false),
      );
      console.log(user);
      if (await onLoginUser(profile.id, user.fcmToken)) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('SignUp', {
          gender: profile.gender.toLowerCase(),
          birthday: profile.birthday,
        });
      }
    } catch (err) {
      if (err.code === 'E_CANCELLED_OPERATION') {
        logCallback(`Login Cancelled:${err.message}`, setLoginLoading(false));
      } else {
        logCallback(
          `Login Failed:${err.code} ${err.message}`,
          setLoginLoading(false),
        );
      }
    }
  };

  const kakaoLogout = async () => {
    logCallback('Logout Start', setLogoutLoading(true));
    try {
      const result = await KakaoLogins.logout();
      setToken(TOKEN_EMPTY);
      setProfile(PROFILE_EMPTY);
      logCallback(`Logout Finished:${result}`, setLogoutLoading(false));
    } catch (err) {
      logCallback(
        `Logout Failed:${err.code} ${err.message}`,
        setLogoutLoading(false),
      );
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
