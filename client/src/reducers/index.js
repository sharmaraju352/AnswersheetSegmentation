import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorsReducer from './errorsReducer';
import segmentationReducer from './segmentationReducer';
import drawing from './drawing';
import game from './game';

export default combineReducers({
  auth: authReducer,
  errors: errorsReducer,
  segmentation: segmentationReducer,
  drawing,
  game
});
