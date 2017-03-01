import { API_HOST, API_AUTH_PATH, API_PROTOCOL } from '../tools/constants'
import * as CategoriesActions  from '../actions/categories'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
  }
}

function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true
  }
}

function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false
  }
}

// Calls the API to get a token and
// dispatches actions along the way
export function loginUser(creds) {

  let credentials = {
    username: creds.username,
    password: creds.password
  }

  let data = JSON.stringify(credentials)

  let config = {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: data
  }

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return fetch(`${API_PROTOCOL}://${API_HOST}${API_AUTH_PATH}`, config)
      .then(response =>
        response.json().then(user => ({ user, response }))
            ).then(({ user, response }) =>  {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          let msg = null
          if (user.description) {
            msg = user.description
          } else {
            msg = response.statusText
          }
          dispatch(loginError(msg))
          return Promise.reject(user)
        } else {
          // If login was successful, set the token in local storage
          localStorage.setItem('api_key', user.api_key)
          // Dispatch the success action
          dispatch(receiveLogin(user))
          dispatch(CategoriesActions.loadAllCategories())
        }
      }).catch(err => {
        if (typeof err.desription !== 'undefined') {
          dispatch(loginError(err.description))
        } else if (err.name === 'TypeError') {
          dispatch(loginError("Network problem"))
        }
      })
  }
}

// Logs the user out
export function logoutUser() {
  return dispatch => {
    dispatch(requestLogout())
    localStorage.removeItem('id_token')
    localStorage.removeItem('api_key')
    dispatch(receiveLogout())
  }
}

// Check the token validity
export function is_auth_valid() {

  let api_key = localStorage.getItem('api_key')

  if (typeof api_key !== 'undefined' && api_key !== null) {
    // do a request to check token validity
    let config = {
      method: 'GET',
      headers: { 'Authorization':`API_KEY ${api_key}`},
    }
    return dispatch => {
      return fetch(`${API_PROTOCOL}://${API_HOST}${API_AUTH_PATH}`, config)
        .then(response =>
          response.json().then(user => ({ user, response }))
              ).then(({ user, response }) =>  {
          if (!response.ok) {
            let msg = null
            if (user.description) {
              msg = user.description
            } else {
              msg = response.statusText
            }
            dispatch(loginError(msg))
            return Promise.reject(user)
          } else {
            // Dispatch the success action
            dispatch(receiveLogin(user))
          }
        }).catch(err => {
          if (typeof err.desription !== 'undefined') {
            console.error("unknown")
            dispatch(loginError(err.description))
          } else if (err.name === 'TypeError') {
            console.error("Network problems")
            // dispatch(loginError("Network problem"))
          }
        })
      }

  }
  return {type: null}

}
