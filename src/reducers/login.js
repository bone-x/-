import { LOGIN } from '../constants/counter'
const INITIAL_STATE = {
  openId: null,
  token: null
}
const Login = (state, token) => {
    return {
        token: token,
    }
}

export default function loginReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        ...Login(state, action.user)
      }
    default:
      return state
  }
}