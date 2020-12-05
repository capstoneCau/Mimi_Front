//Action Type
const GET_ANIMAL_SIMILARITY = 'animal/GET_ANIMAL_SIMILARITY';
const GET_ANIMAL_ERROR = 'animal/GET_ANIMAL_ERROR';
const INIT_ANIMAL = 'animal/INIT_ANIMAL';
//Thunk
export const getAnimalSimilarity = (result) => (dispatch, getState) => {
  console.log(result);
  if (result.error) {
    const error = result.error;
    dispatch({type: GET_ANIMAL_ERROR, error});
  } else {
    dispatch({type: GET_ANIMAL_SIMILARITY, result});
  }
};
export const initAnimal = () => ({type: INIT_ANIMAL});

//초기상태
const initialState = {
  result: [],
  error: -1,
};

//리듀서 작성
export default function animal(state = initialState, action) {
  switch (action.type) {
    case GET_ANIMAL_SIMILARITY:
      return {
        ...state,
        result: action.result,
      };
    case GET_ANIMAL_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case INIT_ANIMAL:
      return {
        result: [],
        error: -1,
      };
    default:
      return state;
  }
}
