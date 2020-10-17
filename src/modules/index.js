import meetingInfo from './meetingInfo';
import login from './login';
import requestInfo from './requestInfo';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  meetingInfo, login, requestInfo
});

export default rootReducer;
