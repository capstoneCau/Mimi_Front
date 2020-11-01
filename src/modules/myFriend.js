import {SERVER_DOMAIN} from '../common/common';

//Action Type
const MY_FRIENDS_LIST = 'myFriend/MY_FRIENDS_LIST';
const GET_FRIENDS_INFO = 'myFriend/GET_FRIENDS_INFO';

//Thunk
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
};
export const getFriendInfo = (token) => async (dispatch, getState) => {
  const friendsInfo = await fetch(SERVER_DOMAIN + 'request/userinfo/', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  console.log(JSON.stringify(friendsInfo));
  dispatch({type: GET_FRIENDS_INFO});
};
//초기상태
const initialState = {};

//리듀서 작성
export default function myFriend(state = initialState, action) {
  switch (action.type) {
    case MY_FRIENDS_LIST:
      return {
        ...state,
        myFriend: action.myFriend,
      };
    default:
      return state;
  }
}
