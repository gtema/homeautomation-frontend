import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

import api from '../middleware/api'
import * as CategoriesActions  from '../actions/categories'

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, createLogger(), api)
  )

  // Feed initial categories and products
  store.dispatch(CategoriesActions.loadAllCategories())

  return store
}

export default configureStore
