import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import DevTools from '../containers/DevTools'
import * as CategoriesActions  from '../actions/categories'

import { is_auth_valid } from '../actions/auth'

import api from '../middleware/api'

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunk, createLogger(), api),
      DevTools.instrument()
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  // Check the authorization
  store.dispatch(is_auth_valid())
  // Feed initial categories and products
  store.dispatch(CategoriesActions.loadAllCategories())


  return store
}

export default configureStore
