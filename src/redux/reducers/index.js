import { combineReducers } from 'redux';
import periodReducer from './periodReducer';

export default combineReducers({
  period: periodReducer,
});
