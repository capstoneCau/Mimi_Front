import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import KakaoLogins from "@react-native-seoul/kakao-login";
import { useSelector } from 'react-redux';

export default function KakaoLoginBtn() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  // const [unlinkLoading, setUnlinkLoading] = useState(false);
  const [token, setToken] = useState(TOKEN_EMPTY);
  const [profile, setProfile] = useState(PROFILE_EMPTY);
  const [isLogin, setIsLogin] = useState(false);
  // const user = useSelector(state => state.login);


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

  const kakaoLogin = async () => {
    logCallback('Login Start', setLoginLoading(true));
    try {
      const result = await KakaoLogins.login();
      setIsLogin(true)
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
      const id = profile.id
      console.log(id)
    } catch(err) {
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
        const result = await KakaoLogins.logout()
        setToken(TOKEN_EMPTY);
        setProfile(PROFILE_EMPTY);
        logCallback(`Logout Finished:${result}`, setLogoutLoading(false));
        setIsLogin(false)
    }catch(err) {
        logCallback(
            `Logout Failed:${err.code} ${err.message}`,
            setLogoutLoading(false),
          );
    }
  };

  return (
    <TouchableOpacity
      onPress={ !isLogin ? kakaoLogin : kakaoLogout}>
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
