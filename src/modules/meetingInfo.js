//Action Type
const ADD_MY_MEETING = 'meetingInfo/ADD_MY_MEETING';
//Action Function
export const addMyMeeting = (myMeetingInfo) => ({
  type: ADD_MY_MEETING,
  myMeetingInfo,
});
//Thunk
export const addMyMeetingAsync = (myMeetingInfo) => async (
  dispatch,
  getState,
) => {
  dispatch({type: ADD_MY_MEETING}, myMeetingInfo);
};

//Initial State
const initialState = {
  myMeetingId: 0,
  myMeetingExist: false,
  myMeeting: [],
};

//Reducer
export default function meetingInfo(state = initialState, action) {
  switch (action.type) {
    case ADD_MY_MEETING:
      return {
        ...state,
      };
    default:
      return state;
  }
}
