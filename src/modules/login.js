import auth from '@react-native-firebase/auth';

import {SERVER_DOMAIN} from '../common/common';
import infoToLocal from '../common/InfoToLocal';
//Action Type
const LOGIN_USER = 'login/LOGIN_USER';
const LOGOUT = 'login/LOGOUT';
const REGISTER_USER_INFO = 'login/REGISTER_USER_INFO';
const REQUEST_KAKAO_AUTH_ID = 'login/REQUEST_KAKAO_AUTH_ID';
const FCM_TOKEN = 'login/FCM_TOKEN';
const FIREBASE_AUTH_UID = 'login/FIREBASE_AUTH_UID';

//Action Function
export const logout = () => ({type: LOGOUT});
export const registerUserInfo = () => ({type: REGISTER_USER_INFO});
export const requestKaKaoAuthId = () => ({type: REQUEST_KAKAO_AUTH_ID});
//Thunk
export const logoutAsync = (token) => async (dispatch, getState) => {
  await fetch(SERVER_DOMAIN + 'api/auth/logout/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  dispatch({type: LOGOUT});
};
export const registerUserInfoAsync = (userInfo) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(SERVER_DOMAIN + 'api/auth/register/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });
  const registerdUserInfo = await res.json();
  const token = registerdUserInfo.token;
  delete registerdUserInfo.token;
  dispatch({type: REGISTER_USER_INFO, userInfo: registerdUserInfo, token});
};

export const requestKaKaoAuthIdAsync = (kakaoId, fcmToken) => async (
  dispatch,
  getState,
) => {
  dispatch({type: FCM_TOKEN, fcmToken});
  const res = await fetch(SERVER_DOMAIN + 'api/auth/login/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      kakao_auth_id: kakaoId,
    }),
  });
  const result = await res.json();
  if (result['user'] == null) {
    dispatch({type: REQUEST_KAKAO_AUTH_ID, kakaoId});
    return false;
  } else {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        result.user.email,
        result.user.kakao_auth_id,
      );

      const {uid} = userCredential.user;
      dispatch({type: FIREBASE_AUTH_UID, uid});
      await infoToLocal('kakaoId', kakaoId);
      const res = await fetch(SERVER_DOMAIN + `user/fcmToken/${kakaoId}/`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fcmToken: fcmToken,
        }),
      });
      const json = await res.json();

      dispatch({type: LOGIN_USER, userInfo: result.user, token: result.token});
      return true;
    } catch (error) {
      // error.code를 보고 사용자 메일 인증이 잘 되었는지 판단할 수 있음..
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      if (error.code === 'auth/invalid-email-verified') {
        console.log('invalid-email-verified');
      }

      return false;
    }
  }
};

// 초기 상태
const initialState = {
  isLogin: false,
};

// 리듀서 작성
export default function login(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isLogin: true,
        userInfo: action.userInfo,
        token: action.token,
      };
    case LOGOUT:
      return {
        ...state,
      };
    case REGISTER_USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
        token: action.token,
      };
    case REQUEST_KAKAO_AUTH_ID:
      return {
        ...state,
        kakaoId: action.kakaoId,
      };
    case FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.fcmToken,
      };
    case FIREBASE_AUTH_UID:
      return {
        ...state,
        uid: action.uid,
      };
    default:
      return state;
  }
}
