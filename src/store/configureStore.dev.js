import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import DevTools from '../containers/DevTools'
import * as CategoriesActions  from '../actions/categories'
// import { receiveProducts }  from '../actions/products'
// import { callAPIMiddleware } from '../tools/common'
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

  // Feed initial categories and products
  // store.dispatch(receiveCategories(require('./categories.json')))
  store.dispatch(CategoriesActions.loadAllCategories())
  // store.dispatch(receiveProducts(require('./products.json')))

  return store
}

export default configureStore
