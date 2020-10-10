import meetingInfo from './meetingInfo';
import login from './login';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  meetingInfo, login
});

export default rootReducer;
