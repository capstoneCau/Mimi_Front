import meetingInfo from './meetingInfo';
import login from './login';
import requestInfo from './requestInfo';
import myFriend from './myFriend';
import animal from './animal';
import safeReturn from './safeReturn';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  meetingInfo,
  login,
  requestInfo,
  myFriend,
  animal,
  safeReturn,
});

export default rootReducer;
