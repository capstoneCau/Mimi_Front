import {SERVER_DOMAIN} from '../common/common';

//Action Type
const MY_FRIENDS_LIST = 'myFriend/MY_FRIENDS_LIST';

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
  console.log(JSON.stringify(myFriends));
  dispatch({type: MY_FRIENDS_LIST, myFriend: myFriends});
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
