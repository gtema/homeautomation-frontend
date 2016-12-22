import categories from './categories'
import products from './products'
import productItems from './productItems'
import ui from './ui'
import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

const rootReducer = combineReducers({
  categories,
  products,
  productItems,
  ui,
  routing
})

export default rootReducer
