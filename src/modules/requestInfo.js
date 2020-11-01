import {SERVER_DOMAIN} from '../common/common';

//Action Type
const GET_INVITER_PARTICIPATE_REQUEST =
  'request/GET_INVITER_PARTICIPATE_REQUESST';
const GET_INVITER_CREATE_REQUEST = 'request/GET_INVITER_CREATE_REQUEST';

const GET_INVITEE_PARTICIPATE_REQUESST =
  'request/GET_INVITEE_PARTICIPATE_REQUESST';
const GET_INVITEE_CREATE_REQUEST = 'request/GET_INVITEE_CREATE_REQUEST';

const GET_REQUEST_USER_INFO = 'request/GET_REQUEST_USER_INFO';
const GET_REQUEST_ROOM_INFO = 'request/GET_REQUEST_ROOM_INFO';

const UPDATE_REQUEST = 'request/UPDATE_REQUEST';
const PARTICIPATE_MEETING = 'request/PARTICIPATE_MEETING';

//Thunk
export const getInviterParticipateRequest = (token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(SERVER_DOMAIN + 'request/inviter/participate/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const inviterParticipateRequestList = await res.json();
  console.log('dd' + JSON.stringify(inviterParticipateRequestList));

  if (JSON.error) {
    console.log(JSON.detail);
    return false;
  } else {
    dispatch({
      type: GET_INVITER_PARTICIPATE_REQUEST,
      inviterParticipateRequestList,
    });
    return true;
  }
};

export const getInviterCreateRequest = (token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(SERVER_DOMAIN + 'request/inviter/create/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const inviterCreateRequestList = await res.json();
  if (JSON.error) {
    console.log(JSON.detail);
    return false;
  } else {
    dispatch({
      type: GET_INVITER_CREATE_REQUEST,
      inviterCreateRequestList,
    });
    return true;
  }
};

export const getInviteeParticipateRequest = (token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(SERVER_DOMAIN + 'request/invitee/participate/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const inviteeParticipateRequestList = await res.json();
  if (JSON.error) {
    console.log(JSON.detail);
    return false;
  } else {
    dispatch({
      type: GET_INVITEE_PARTICIPATE_REQUESST,
      inviteeParticipateRequestList,
    });
    return true;
  }
};

export const getInviteeCreateRequest = (token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(SERVER_DOMAIN + 'request/invitee/create/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const inviteeCreateRequestList = await res.json();
  if (JSON.error) {
    console.log(JSON.detail);
    return false;
  } else {
    dispatch({type: GET_INVITEE_CREATE_REQUEST, inviteeCreateRequestList});
    return true;
  }
};

export const getRequestUserInfo = (request_id, token) => async (
  dispach,
  getState,
) => {
  const res = await fetch(SERVER_DOMAIN + 'request/userinfo/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    Body: JSON.stringify({request: request_id}),
  });
  const userInfoList = await res.json();
  dispach({type: GET_REQUEST_USER_INFO});
  return userInfoList;
};

export const getRequestRoomInfo = (request_id, token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(SERVER_DOMAIN + `request/roominfo/${request_id}/`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const roomInfo = await res.json();
  dispatch({type: GET_REQUEST_ROOM_INFO});
  return roomInfo;
};

export const updateRequest = (type, is_accepted, request_id, token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(
    SERVER_DOMAIN + `request/invitee/${type}/${request_id}/`,
    {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({is_accepted: is_accepted}),
    },
  );
  //   const list =
  //     type == 'create' ? inviteeCreateList.status : inviteeParticiateList.status;
  //   list.forEach((element) => {
  //     if (element.id == action.requestInfo.id) {
  //       element = action.request;
  //     }
  //   });
  const requestInfo = await res.json();
  //   dispatch({type: UPDATE_REQUEST, requestInfo, type});
  dispatch({type: UPDATE_REQUEST});

  //   return requestInfo;
  // getState().requestInfo.inviteeCreateIdList
};

export const participateAtRoom = (
  participation_user_list,
  room_id,
  token,
) => async (dispach, getState) => {
  const res = await fetch(SERVER_DOMAIN + 'request/inviter/participate/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      participation_user_list: participation_user_list,
      room: room_id,
    }),
  });
  const requestInfo = await res.json();
  dispach({type: PARTICIPATE_MEETING, requestInfo});
  return requestInfo;
  // getState().requestInfo.inviteeCreateIdList
};

//Initial State
const initialState = {
  inviteeCreateList: [],
  inviteeParticiateList: [],

  inviterCreateList: [],
  inviterParticiatList: [],
};

//Reducer
export default function meetingInfo(state = initialState, action) {
  switch (action.type) {
    case GET_INVITER_PARTICIPATE_REQUEST:
      return {
        ...state,
        inviterParticiatList: action.inviterParticipateRequestList,
      };
    case GET_INVITER_CREATE_REQUEST:
      return {
        ...state,
        inviterCreateList: action.inviterCreateRequestList,
      };
    case GET_INVITEE_PARTICIPATE_REQUESST:
      return {
        ...state,
        inviteeParticiateList: action.inviteeParticipateRequestList,
      };
    case GET_INVITEE_CREATE_REQUEST:
      return {
        ...state,
        inviteeCreateList: action.inviteeCreateRequestList,
      };
    case GET_REQUEST_USER_INFO:
      return {
        ...state,
      };
    case GET_REQUEST_ROOM_INFO:
      return {
        ...state,
      };
    case UPDATE_REQUEST:
      return {
        ...state,
      };
    case PARTICIPATE_MEETING:
      //   status.inviterParticiatList.push(action.requestInfo);
      return {
        ...state,
      };
    default:
      return state;
  }
}
