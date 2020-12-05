import {SERVER_DOMAIN} from '../common/common';

//Action Type
const MY_FRIENDS_LIST = 'myFriend/MY_FRIENDS_LIST';
const GET_FRIENDS_INFO = 'myFriend/GET_FRIENDS_INFO';
const ADD_FRIEND = 'myFriend/ADD_FRIEND';
//Thunk
export const addFriend = (token, userId, type) => async (
  dispatch,
  getState,
) => {
  const friends = await fetch(SERVER_DOMAIN + 'user/friends/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to_user: userId,
      type: type,
    }),
  });
  const myFriends = await friends.json();

  dispatch({type: ADD_FRIEND});
};
export const myFriendList = (token) => async (dispatch, getState) => {
  const friends = await fetch(SERVER_DOMAIN + 'user/friends/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const myFriends = await friends.json();
  dispatch({type: MY_FRIENDS_LIST, myFriend: myFriends});
  return myFriends;
};
export const getFriendInfo = (token) => async (dispatch, getState) => {
  const friendsInfo = await fetch(SERVER_DOMAIN + 'request/userinfo/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const myFriends = await friendsInfo.json();
  dispatch({type: GET_FRIENDS_INFO});
};
//초기상태
const initialState = {
  myFriend: [],
};

//리듀서 작성
export default function myFriend(state = initialState, action) {
  switch (action.type) {
    case MY_FRIENDS_LIST:
      return {
        ...state,
        myFriend: action.myFriend,
      };
    case ADD_FRIEND:
      return {
        ...state,
      };
    default:
      return state;
  }
}
