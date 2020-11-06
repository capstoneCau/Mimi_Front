import meetingInfo from './meetingInfo';
import login from './login';
import requestInfo from './requestInfo';
import myFriend from './myFriend';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  meetingInfo,
  login,
  requestInfo,
  myFriend,
});

export default rootReducer;
