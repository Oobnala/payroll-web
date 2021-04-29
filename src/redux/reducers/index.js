import { combineReducers } from 'redux';
import periodReducer from './periodReducer';
import employeeReducer from './employeeReducer';

export default combineReducers({
  period: periodReducer,
  employee: employeeReducer,
});
