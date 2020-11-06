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
  dispatch({type: GET_ROOM, allRoomList});
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

export const getOwnsRoomList = (token) => async (dispatch, getState) => {
  const res = await fetch(SERVER_DOMAIN + `meeting/ownsRoomList/`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const userInfoList = await res.json();
  dispatch({type: GET_MY_ROOM, userInfoList});
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
      return {
        ...state,
        myRoomList: action.userInfoList,
      };

    default:
      return state;
  }
}
