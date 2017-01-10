import { Map } from 'immutable'
import { reducerRemoveItem, reducerReceiveItems } from '../tools/common'

const ITEMS_BY_ID_KEY = 'categoriesById'
const ITEMS_BY_PARENT_ID_KEY = 'categoriesByGroupId'
const ITEM_PARENT_ATTRIBUTE_NAME = 'parent_id'

const INITIAL_STATE = Map({
  [ITEMS_BY_ID_KEY]: Map(),
  [ITEMS_BY_PARENT_ID_KEY]: Map(),
})

const normalizeFunction = ( item ) => ({
  id: item.id,
  parent_id: item.parent_id,
  name: item.name,
  prio: item.prio,
})

// Reducer
const categories = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_CATEGORY':
    case 'RECEIVE_CATEGORIES':
    case 'RECEIVE_CATEGORY_BY_CATEGORY_ID':
      return reducerReceiveItems(state, ITEMS_BY_ID_KEY, ITEMS_BY_PARENT_ID_KEY, ITEM_PARENT_ATTRIBUTE_NAME, normalizeFunction, false, action)
    case 'RECEIVE_SUBCATEGORIES_BY_CATEGORY_ID':
      // return receiveSubcategoriesByCategoryId(state, action)
      return reducerReceiveItems(state, ITEMS_BY_ID_KEY, ITEMS_BY_PARENT_ID_KEY, ITEM_PARENT_ATTRIBUTE_NAME, normalizeFunction, true, action)
    case 'DELETE_CATEGORY_BY_CATEGORY_ID':
      return reducerRemoveItem(state, ITEMS_BY_ID_KEY, ITEMS_BY_PARENT_ID_KEY, ITEM_PARENT_ATTRIBUTE_NAME, action.id)
      // return removeCategory(state, action.id)
    default:
      return state
  }
}

export default categories
