import {
  SET_UPLOAD_PROGRESS,
  START_LOADING,
  STOP_LOADING,
  SET_QUESTIONS,
  CLEAR_QUESTIONS
} from '../actions/types';

const initialState = {
  seat_number: '',
  selectedFile: null,
  file_uploaded: 0,
  loading: false,
  questions: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_UPLOAD_PROGRESS:
      return {
        ...state,
        file_uploaded: action.payload
      };
    case START_LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case STOP_LOADING:
      return {
        ...state,
        loading: false
      };
    case SET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
        loading: false
      };
    case CLEAR_QUESTIONS:
      console.log('returning blank questions array');
      return {
        ...state,
        questions: [],
        file_uploaded: 0
      };
    default:
      return state;
  }
}
