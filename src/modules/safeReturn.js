import infoToLocal from '../common/InfoToLocal';
import localToInfo from '../common/LocalToInfo';

//Action Type
const START_SAFE_RETURN = 'safeReturn/START_SAFE_RETURN';
const STOP_SAFE_RETURN = 'safeReturn/STOP_SAFE_RETURN';
const SAVE_DESTINATION = 'safeReturn/SAVE_DESTINATION';
const SAVE_RECEIEVERS = 'safeReturn/SAVE_RECEIEVERS';
const CHANGE_USE_SYSTEM_SAFE_RETURN =
  'safeReturn/CHANGE_USE_SYSTEM_SAFE_RETURN';
const CHANGE_IS_SEND_MEETING_MEMBER =
  'safeReturn/CHANGE_IS_SEND_MEETING_MEMBER';
//Thunk
// export const startSafeReturn = (result) => (dispatch, getState) => {
//   console.log(result);
//   if (result.error) {
//     const error = result.error;
//     dispatch({type: GET_ANIMAL_ERROR, error});
//   } else {
//     dispatch({type: GET_ANIMAL_SIMILARITY, result});
//   }
// };

export const initSafeReturnData = () => async (dispatch, getState) => {
  console.log('in initSafeReturnData');
  const autoSafeReturn = await localToInfo('autoSafeReturn');
  const isSendMeetingMember = await localToInfo('isSendMeetingMember');
  dispatch({
    type: START_SAFE_RETURN,
    safeReturnId: await localToInfo('safeReturnId'),
  });
  dispatch({
    type: SAVE_DESTINATION,
    destination: await localToInfo('destination'),
    coordinate: await localToInfo('coordinate'),
  });
  dispatch({
    type: SAVE_RECEIEVERS,
    notiReceiverIds: await localToInfo('notiReceiverIds'),
    notiReceiverNames: await localToInfo('notiReceiverNames'),
  });
  dispatch({
    type: CHANGE_USE_SYSTEM_SAFE_RETURN,
    isAuto: autoSafeReturn != null ? autoSafeReturn : false,
  });
  dispatch({
    type: CHANGE_IS_SEND_MEETING_MEMBER,
    isSendMeetingMember:
      isSendMeetingMember != null ? isSendMeetingMember : true,
  });
};

export const startSafeReturn = (safeReturnId) => (dispatch, getState) => {
  console.log('in startSafeReturn', safeReturnId);
  infoToLocal('safeReturnId', safeReturnId);
  dispatch({
    type: START_SAFE_RETURN,
    safeReturnId,
  });
};
export const stopSafeReturn = () => (dispatch, getState) => {
  console.log('in stopSafeReturn');
  infoToLocal('safeReturnId', null);
  dispatch({type: STOP_SAFE_RETURN});
};
export const saveDestination = (destination, coordinate) => (
  dispatch,
  getState,
) => {
  console.log(
    'in saveDestination',
    'destination:',
    destination,
    'coordinate:',
    coordinate,
  );
  infoToLocal('destination', destination);
  infoToLocal('coordinate', coordinate);
  dispatch({
    type: SAVE_DESTINATION,
    destination,
    coordinate,
  });
};
export const saveReceievers = (ids, names) => (dispatch, getState) => {
  console.log('in saveReceievers', 'ids:', ids, 'names:', names);
  infoToLocal('notiReceiverIds', ids);
  infoToLocal('notiReceiverNames', ids);
  dispatch({
    type: SAVE_RECEIEVERS,
    notiReceiverIds: ids,
    notiReceiverNames: names,
  });
};
export const changeUseSystemSafeReturn = (isAuto) => (dispatch, getState) => {
  console.log('in changeUseSystemSafeReturn', isAuto);
  infoToLocal('autoSafeReturn', isAuto);
  dispatch({
    type: CHANGE_USE_SYSTEM_SAFE_RETURN,
    isAuto,
  });
};
export const changeIsSendMeetingMember = (isSendMeetingMember) => (
  dispatch,
  getState,
) => {
  console.log('in changeIsSendMeetingMember', isSendMeetingMember);
  infoToLocal('isSendMeetingMember', isSendMeetingMember);
  dispatch({
    type: CHANGE_IS_SEND_MEETING_MEMBER,
    isSendMeetingMember,
  });
};
//초기상태
const initialState = {
  safeReturnId: null,
  isAuto: false,
  destination: '',
  coordinate: {},
  notiReceiverIds: [],
  notiReceiverNames: [],
  isSendMeetingMember: true,
};

//리듀서 작성
export default function safeReturn(state = initialState, action) {
  //   console.log(action.isAuto, action.type);
  switch (action.type) {
    case START_SAFE_RETURN:
      return {
        ...state,
        safeReturnId: action.safeReturnId,
      };
    case STOP_SAFE_RETURN:
      return {
        ...state,
        safeReturnId: null,
      };
    case SAVE_DESTINATION:
      return {
        ...state,
        destination: action.destination,
        coordinate: action.coordinate,
      };
    case SAVE_RECEIEVERS:
      return {
        ...state,
        notiReceiverIds: action.notiReceiverIds,
        notiReceiverNames: action.notiReceiverNames,
      };
    case CHANGE_USE_SYSTEM_SAFE_RETURN:
      //   console.log(action.isAuto);
      return {
        ...state,
        isAuto: action.isAuto,
      };
    case CHANGE_IS_SEND_MEETING_MEMBER:
      return {
        ...state,
        isSendMeetingMember: action.isSendMeetingMember,
      };
    default:
      return state;
  }
}
