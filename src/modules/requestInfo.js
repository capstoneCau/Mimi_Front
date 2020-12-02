import {SERVER_DOMAIN} from '../common/common';
import State from '../screens/StateGive';

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
const REMOVE_MEETING = 'request/REMOVE_MEETING';
const REMOVE_PARTICIPATE = 'request/REMOVE_PARTICIPATE';
const GET_MATCHING_SELECT_INFO = 'request/GET_MATCHING_SELECT_INFO';
const MATCH_MEETING = 'request/MATCH_MEETING';
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

export const getRequestUserInfo = (request, token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(
    SERVER_DOMAIN + `request/userinfo?request=${request}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  const userInfoList = await res.json();
  dispatch({type: GET_REQUEST_USER_INFO});
  return userInfoList;
};

export const getRequestRoomInfo = (request_id, token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(
    SERVER_DOMAIN + `request/roominfo?request=${request_id}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
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

export const removeMeeting = (
  room_id,
  chat_id,
  is_notification,
  token,
) => async (dispatch, getState) => {
  console.log(chat_id, is_notification);
  const res = await fetch(SERVER_DOMAIN + `meeting/roomList/${room_id}/`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId: chat_id,
      isNotification: is_notification,
    }),
  });
  const requestInfo = await res.json();
  dispatch({type: REMOVE_MEETING});
};

export const removeParticipate = (party_id, token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(
    SERVER_DOMAIN + `request/inviter/participate/${party_id}/`,
    {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  const requestInfo = await res.json();
  dispatch({type: REMOVE_PARTICIPATE});
};

export const getMatchingSelectInfo = (request_id, token) => async (
  dispatch,
  getState,
) => {
  const res = await fetch(
    SERVER_DOMAIN + `request/select?request=${request_id}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  const requestInfo = await res.json();
  dispatch({type: GET_MATCHING_SELECT_INFO});
  return requestInfo;
};

export const matchMeeting = (party_id, token) => async (dispatch, getState) => {
  const res = await fetch(SERVER_DOMAIN + `request/select/${party_id}/`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const requestInfo = await res.json();
  dispatch({type: MATCH_MEETING});
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
    case REMOVE_MEETING:
      return {
        ...state,
      };
    case REMOVE_PARTICIPATE:
      return {
        ...state,
      };
    case GET_MATCHING_SELECT_INFO:
      return {
        ...state,
      };
    case MATCH_MEETING:
      return {
        ...state,
      };
    default:
      return state;
  }
}
