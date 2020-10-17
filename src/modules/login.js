
import SERVER_DOMAIN from '../common/common'

//Action Type
const LOGIN_USER = 'login/LOGIN_USER';
const LOGOUT = 'login/LOGOUT';
const REGISTER_USER_INFO = 'login/REGISTER_USER_INFO';
const REQUEST_KAKAO_AUTH_ID = 'login/REQUEST_KAKAO_AUTH_ID';

//Action Function
export const loginUser = (kakaoId) => ({type: LOGIN_USER}, userInfo);
export const logout = () => ({type: LOGOUT});
export const registerUserInfo = () => ({type: REGISTER_USER_INFO});
export const requestKaKaoAuthId = () => ({type: REQUEST_KAKAO_AUTH_ID});

//Thunk
export const loginUserAsync = (userInfo, kakaoId) => async (
  dispatch,
  getState,
) => {
  dispatch({type: LOGIN_USER, userInfo, kakaoId});
};
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
export const registerUserInfoAsync = (userInfo) => async (
  dispatch,
  getState,
) => {
  await fetch(SERVER_DOMAIN + 'api/auth/register/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo), 
  });
  dispatch({type: REGISTER_USER_INFO});
};


export const requestKaKaoAuthIdAsync = (kakaoId) => async ( dispatch, getState ) => {
  const res = await fetch(SERVER_DOMAIN + `api/auth/login/`, {
    body : JSON.stringify({
      "kakao_auth_id" : kakaoId
    }),
    method: "POST"
  });
  const userInfo = await res.json();
  if (userInfo['kakao_id'] == null) {
    dispatch({type: REQUEST_KAKAO_AUTH_ID, kakaoId});
    return false;
  } else {
    dispatch({type: LOGIN_USER, userInfo});
    return true;
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
        userInfo: action.userInfo.user,
        token : action.userInfo.token
      };
    case LOGOUT:
      return {
        ...state
      };
    case REGISTER_USER_INFO:
      return {
        ...state,
      };
    case REQUEST_KAKAO_AUTH_ID:
      return {
        ...state,
        kakaoId: action.kakaoId,
      };
    default:
      return state;
  }
}
