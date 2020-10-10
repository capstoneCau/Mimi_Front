const SERVER_DOMAIN = "https://mimi-server-akuui.run.goorm.io/"
//Action Type
const LOGIN_USER = 'login/LOGIN_USER';
const LOGOUT = 'login/LOGOUT'
const REGISTER_USER_INFO = 'login/REGISTER_USER_INFO'
const REQUEST_KAKAO_AUTH_ID = 'login/REQUEST_KAKAO_AUTH_ID'


//Action Function
export const loginUser = (kakaoId) => ({type: LOGIN_USER}, userInfo);
export const logout = () => ({type: LOGOUT});
export const registerUserInfo = () => ({type: REGISTER_USER_INFO})
export const requestKaKaoAuthId = () => ({type: REQUEST_KAKAO_AUTH_ID})

//Thunk
export const loginUserAsync = (userInfo, kakaoId) => async (dispatch, getState) => {
    dispatch({type:LOGIN_USER, userInfo, kakaoId});
}
export const logoutAsync = () => async (dispatch, getState) => {
    dispatch({type:LOGOUT});
}
export const registerUserInfoAsync = (userInfo) => async (dispatch, getState) => {
    
    await fetch('https://mimi-server-akuui.run.goorm.io/api/v1/user/users/', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(userInfo), // body data type must match "Content-Type" header
    })
    dispatch({type:REGISTER_USER_INFO});
}

export const requestKaKaoAuthIdAsync = (kakaoId) => async (dispatch, getState) => {1
    const res = await fetch(SERVER_DOMAIN + `api/v1/user/users/${kakaoId}`)
    const userInfo = await res.json()
    if (userInfo["kakao_id"] == null) {
        dispatch({type:REQUEST_KAKAO_AUTH_ID, kakaoId})
        return false
    } else {
        dispatch({type:LOGIN_USER, userInfo});
        return true
    }

}

// 초기 상태
const initialState = {
    isLogin: false
}

// 리듀서 작성
export default function login(state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return{
                ...state,
                isLogin: true,
                userInfo: action.userInfo,
            }
        case LOGOUT:
            return{
                ...state,
                isLogin: false,
                kakaoId: null,
                userInfo: {},
            }
        case REGISTER_USER_INFO:
            return{
                ...state,
            }
        case REQUEST_KAKAO_AUTH_ID:
            return{
                ...state,
                kakaoId: action.kakaoId
            }
        default:
            return state;
    }
}