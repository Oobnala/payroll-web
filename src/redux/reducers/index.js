import { combineReducers } from 'redux';
import periodReducer from './periodReducer';
import employeeReducer from './employeeReducer';
import historyReducer from './historyReducer';

export default combineReducers({
  period: periodReducer,
  employee: employeeReducer,
  history: historyReducer,
});
