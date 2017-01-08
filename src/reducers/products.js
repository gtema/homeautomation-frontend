import { Map } from 'immutable'
import { reducerRemoveItem, reducerReceiveItems } from '../tools/common'

const ITEMS_BY_ID_KEY = 'productsById'
const ITEMS_BY_PARENT_ID_KEY = 'productsByCategoryId'
const ITEM_PARENT_ATTRIBUTE_NAME = 'category_id'

const INITIAL_STATE = Map({
  [ITEMS_BY_ID_KEY]: Map(),
  [ITEMS_BY_PARENT_ID_KEY]: Map(),
})

const normalizeFunction = ( item ) => ({
  id: item.id,
  category_id: item.category_id,
  name: item.name,
  volume: item.volume,
  amount: item.amount,
  count_quantities: item.count_quantities,
  first_started_id: item.first_started_id,
  first_started_ed: item.first_started_ed
})

// Reducer
const products = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
    case 'RECEIVE_PRODUCTS':
    case 'RECEIVE_PRODUCT_BY_PRODUCT_ID':
      return reducerReceiveItems(state, ITEMS_BY_ID_KEY, ITEMS_BY_PARENT_ID_KEY, ITEM_PARENT_ATTRIBUTE_NAME, normalizeFunction, false, action)
    case 'RECEIVE_PRODUCTS_BY_CATEGORY_ID':
      return reducerReceiveItems(state, ITEMS_BY_ID_KEY, ITEMS_BY_PARENT_ID_KEY, ITEM_PARENT_ATTRIBUTE_NAME, normalizeFunction, true, action)
    case 'DELETE_PRODUCT_BY_ID':
      return reducerRemoveItem(state, ITEMS_BY_ID_KEY, ITEMS_BY_PARENT_ID_KEY, ITEM_PARENT_ATTRIBUTE_NAME, action.id)
    default:
      return state
  }
}

export default products
