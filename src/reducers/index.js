import { combineReducers } from 'redux'
import counter from './counter'
import loginReducer from './login'
export default combineReducers({
  counter,
  loginReducer
})
