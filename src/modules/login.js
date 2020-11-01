
import {SERVER_DOMAIN} from '../common/common'

//Action Type
const LOGIN_USER = 'login/LOGIN_USER';
const LOGOUT = 'login/LOGOUT';
const REGISTER_USER_INFO = 'login/REGISTER_USER_INFO';
const REQUEST_KAKAO_AUTH_ID = 'login/REQUEST_KAKAO_AUTH_ID';
const FCM_TOKEN = 'login/FCM_TOKEN'

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
      'Authorization': `Token ${token}`,
    }
  })
  dispatch({type: LOGOUT});
};
export const registerUserInfoAsync = (userInfo) => async (dispatch, getState) => {
  const res = await fetch(SERVER_DOMAIN + 'api/auth/register/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo), 
  });
  const registerdUserInfo = await res.json()
  const token = registerdUserInfo.token
  delete registerdUserInfo.token
  dispatch({type: REGISTER_USER_INFO, userInfo: registerdUserInfo, token});
};


export const requestKaKaoAuthIdAsync = (kakaoId) => async ( dispatch, getState ) => {
  const res = await fetch(SERVER_DOMAIN + 'api/auth/login/', {
    method: "POST",
    mode: 'cors',
    body : JSON.stringify({
      "kakao_auth_id" : kakaoId
    }),
  });
  const result = await res.json();
  if (result['kakao_id'] == null) {
    dispatch({type: REQUEST_KAKAO_AUTH_ID, kakaoId});
    return false;
  } else {
    dispatch({type: LOGIN_USER, userInfo: result.user, token: result.token});
    return true;
  }
};

export const fcmTokenAsync = (fcmToken, token=null) => async ( dispatch, getState ) => {
  if(token != null) {
    const res = await fetch(SERVER_DOMAIN + 'user/fcmtoken/', {
      method: "PATCH",
      mode: 'cors',
      headers: {
        'Authorization' : `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({
        "fcmtoken" : fcmToken
      }),
    })
    const json = await res.json()
    console.log(json)
  }
  console.log(fcmToken)
  dispatch({type: FCM_TOKEN, fcmToken});
}

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
        token : action.token
      };
    case LOGOUT:
      return {
        ...state
      };
    case REGISTER_USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
        token: action.token
      };
    case REQUEST_KAKAO_AUTH_ID:
      return {
        ...state,
        kakaoId: action.kakaoId,
      };
    case FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.fcmToken
      }
    default:
      return state;
  }
}
