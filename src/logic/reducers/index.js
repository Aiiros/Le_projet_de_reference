import { combineReducers } from 'redux';
import AuthReducer from './auth_reducer';
import DataReducer from './data_reducer';

export default combineReducers({
  Auth: AuthReducer,
  Data: DataReducer
});
