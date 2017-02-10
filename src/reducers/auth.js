import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS
} from '../actions/auth'

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
const auth = (state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('api_key') ? true : false
  }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, isFetching:true, isAuthenticated: false, user: action.creds}
      // return Object.assign({}, state, {
      //   isFetching: true,
      //   isAuthenticated: false,
      //   user: action.creds
      // })
    case LOGIN_SUCCESS:
      return { ...state, isFetching:false, isAuthenticated: true, errorMessage: ''}
      // return Object.assign({}, state, {
      //   isFetching: false,
      //   isAuthenticated: true,
      //   errorMessage: ''
      // })
    case LOGIN_FAILURE:
      return { ...state, isFetching:false, isAuthenticated: false, errorMessage: action.message}
      // return Object.assign({}, state, {
      //   isFetching: false,
      //   isAuthenticated: false,
      //   errorMessage: action.message
      // })
    case LOGOUT_SUCCESS:
      return { ...state, isFetching:true, isAuthenticated: false}
      // return Object.assign({}, state, {
      //   isFetching: true,
      //   isAuthenticated: false
      // })
    default:
      return state
  }
}

export default auth
