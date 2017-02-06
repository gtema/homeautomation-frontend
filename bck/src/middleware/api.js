import { Schema, arrayOf } from 'normalizr'
// import { camelizeKeys } from 'humps'
import fetch  from 'isomorphic-fetch'

import { API_HOST, API_PATH } from '../tools/constants'

// Extracts the next page URL from Github API response.
// const getNextPageUrl = response => {
//   const link = response.headers.get('link')
//   if (!link) {
//     return null
//   }
//
//   const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
//   if (!nextLink) {
//     return null
//   }
//
//   return nextLink.split(';')[0].slice(1, -1)
// }

const API_ROOT = `http://${API_HOST}${API_PATH}`//'http://localhost:5000/api/v0/stock/'

export const Methods = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  DELETE: "DELETE"
}

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, schema, method, payload, authenticated) => {

  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
  let headers = new Headers()

  let data = null;
  if (Methods.POST === method || Methods.PUT === method) {
    headers.append('Content-Type', 'application/json')
    data = JSON.stringify(payload)
  }

  // Handle JWT
  const token   = localStorage.getItem('id_token') || null
  const api_key = localStorage.getItem('api_key') || null

  if (api_key) {
    headers.append('Authorization', `API_KEY ${api_key}`)
  }
  if (token) {
    headers.append('Authorization', `JWT ${token}`)
  }

  let request = new Request(fullUrl, {
  	method: method || Methods.GET,
  	mode: 'cors',
  	redirect: 'follow',
  	headers: headers,
    body: (data)? data: null
  });

  return fetch(request)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json)
        }

        // const camelizedJson = camelizeKeys(json)
        // const nextPageUrl = getNextPageUrl(response)

        // return Object.assign({},
          // normalize(json, schema)
        //   { nextPageUrl }
        // )
        return json
      })
    )
}

const productSchema = new Schema('products', {
  idAttribute: 'id'
})
const productItemSchema = new Schema('productItems', {
  idAttribute: 'id'
})
const categorySchema = new Schema('categories', {
  idAttribute: 'id'
})

export const Schemas = {
  PRODUCT: productSchema,
  PRODUCT_ARRAY: arrayOf(productSchema),
  PRODUCT_ITEM: productItemSchema,
  PRODUCT_ITEM_ARRAY: arrayOf(productItemSchema),
  CATEGORY: categorySchema,
  CATEGORY_ARRAY: arrayOf(categorySchema)
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API')

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint } = callAPI
  const {
    schema,
    types,
    payload,
    shouldCallAPI = () => true,
    method,
    postSuccessCallback,
    authenticated
  } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof shouldCallAPI === 'function') {
    if (!shouldCallAPI(store.getState())) {
      return
    }
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  // Dispatch the request action
  next(actionWith(Object.assign({}, payload, { type: requestType }, null, authenticated)))

  // Invoke API and dispatch success/error action
  return callApi(endpoint, schema, method, payload, authenticated).then(
    response => {
      next(actionWith(Object.assign({}, payload, {
          response,
          type: successType,
          timestamp: Date.now(),
          status: 'success',
          authenticated,
        }),
      ))
      /* If we have a CALL_API postSuccessCallback - dispatch it*/
      if (typeof(postSuccessCallback) === 'object' && postSuccessCallback.hasOwnProperty(CALL_API)) {
        store.dispatch(postSuccessCallback)
      }
    },
    error => next(actionWith(Object.assign({}, payload, {
          type: failureType,
          error: error.message || 'Something bad happened',
          timestamp: Date.now(),
          status: 'failure',
          authenticated,
        }),
      ))
  )
}
