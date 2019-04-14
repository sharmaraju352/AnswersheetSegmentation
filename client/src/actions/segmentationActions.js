import axios from 'axios';
import {
  SET_UPLOAD_PROGRESS,
  CLEAR_QUESTIONS,
  START_LOADING,
  STOP_LOADING
} from './types';

export const uploadAnswerSheet = data => dispatch => {
  axios
    .post('/api/segmentation/upload', data, {
      onUploadProgress: ProgressEvent => {
        let progress = (ProgressEvent.loaded / ProgressEvent.total) * 100;
        dispatch({
          type: SET_UPLOAD_PROGRESS,
          payload: progress
        });
        if (progress === 100) {
          console.log('answersheet uploaded successfully');
          dispatch({
            type: START_LOADING
          });
        }
      }
    })
    .then(res => {
      console.log('questions: ', res.data.questions);
      dispatch({
        type: STOP_LOADING
      });
    });
};

export const clearQuestions = () => dispatch => {
  console.log('clearQuestions called');
  dispatch({
    type: CLEAR_QUESTIONS
  });
};
