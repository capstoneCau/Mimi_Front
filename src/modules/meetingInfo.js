import {SERVER_DOMAIN} from '../common/common';

//Action Type

const GET_MY_ROOM = 'meeting/GET_MY_ROOM';

const CREATE_ROOM = 'meeting/CREATE_ROOM';

const GET_ROOM = 'meeting/GET_ROOM';

//Thunk

export const createRoomAsync = (
  init_users,
  available_dates,
  user_limit,
  introduction,
  token,
) => async (dispatch, getState) => {
  console.log(init_users, available_dates, user_limit, introduction, token);
  const res = await fetch(SERVER_DOMAIN + 'meeting/roomList/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      init_users: init_users,
      available_dates: available_dates,
      user_limit: user_limit,
      introduction: introduction,
    }),
  });

  const makeRoomInfo = await res.json();
  dispatch({type: CREATE_ROOM, makeRoomInfo});
  console.log('this' + makeRoomInfo);
  return makeRoomInfo;
};

export const getAllRoomList = (token) => async (dispatch, getState) => {
  const res = await fetch(SERVER_DOMAIN + 'meeting/roomList/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const allRoomList = await res.json();
  dispatch({type: GET_ROOOM, allRoomList});
  return allRoomList;
};

export const getRoomInfo = async (room_id, token) => {
  const res = await fetch(SERVER_DOMAIN + `meeting/roomList/${room_id}/`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const roomInfo = await res.json();
  return roomInfo;
};

export const getParticipatedUserInfoList = async (room_id, token) => {
  const res = await fetch(SERVER_DOMAIN + 'meeting/userinfo/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({room: room_id}),
  });
  const userInfoList = await res.json();
  return userInfoList;
};

export const getOwnsRoomList = (user = null, token) => async (
  dispach,
  getState,
) => {
  const res = await fetch(
    SERVER_DOMAIN + `meeting/ownsRoomList/` + user != null ? `${room_id}/` : '',
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({room: room_id}),
    },
  );
  const userInfoList = await res.json();
  dispatch({type: GET_MY_ROOM, userInfoList, user});
  return userInfoList;
};

//Initial State
const initialState = {
  allRoomList: [],
  myRoomList: [],
};

//Reducer
export default function meetingInfo(state = initialState, action) {
  switch (action.type) {
    case CREATE_ROOM:
      state.myRoomList.push(action.makeRoomInfo);
      return {
        ...state,
      };
    case GET_ROOM:
      return {
        ...state,
        allRoomList: action.allRoomList,
      };
    case GET_MY_ROOM:
      if (action.user != null) {
        return {
          ...state,
        };
      } else {
        return {
          ...state,
          myRoomList: action.myRoomList,
        };
      }
    default:
      return state;
  }
}
