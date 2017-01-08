import { Map } from 'immutable'
import { reducerRemoveItem, reducerReceiveItems } from '../tools/common'

const ITEMS_BY_ID_KEY = "productItemsById"
const ITEMS_BY_PARENT_ID_KEY = "productItemsByProductId"
const ITEM_PARENT_ATTRIBUTE_NAME="product_id"

const INITIAL_STATE = Map({
  [ITEMS_BY_ID_KEY]: Map(),
  [ITEMS_BY_PARENT_ID_KEY]: Map(),
})

const normalizeFunction = ( item ) => ({
  id: item.id,
  product_id: item.product_id,
  is_started: item.is_started,
  is_disposed: item.is_disposed,
  amount: item.amount,
  create_date: item.create_date,
  expiry_date: item.expiry_date
})

// Reducer
const productItems = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT_ITEM':
    case 'RECEIVE_PRODUCT_ITEMS':
    case 'RECEIVE_PRODUCT_ITEM_BY_ID':
      return reducerReceiveItems(state, ITEMS_BY_ID_KEY, ITEMS_BY_PARENT_ID_KEY, ITEM_PARENT_ATTRIBUTE_NAME, normalizeFunction, false, action)
    case 'RECEIVE_PRODUCT_ITEMS_BY_PRODUCT_ID':
      return reducerReceiveItems(state, ITEMS_BY_ID_KEY, ITEMS_BY_PARENT_ID_KEY, ITEM_PARENT_ATTRIBUTE_NAME, normalizeFunction, true, action)
    case 'DELETE_PRODUCT_ITEM_BY_ID':
      return reducerRemoveItem(state, ITEMS_BY_ID_KEY, ITEMS_BY_PARENT_ID_KEY, ITEM_PARENT_ATTRIBUTE_NAME, action.id)
    default:
      return state
  }
}

export default productItems
