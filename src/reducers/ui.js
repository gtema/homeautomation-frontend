import { Map, fromJS } from 'immutable'

const INITIAL_UI_STATE = Map({
  categoryEditId: null,
  productEditId: null,
  productItemEditId: null,
  categoryAddMode: false,
  productAddMode: false,
  alertText: '',
  alertType: '',
  fetchingInitialCategories: false,
})


// Categories reducer
const ui = (state = INITIAL_UI_STATE, action) => {
  switch (action.type) {
    // Modes switch
    case 'TOGGLE_CATEGORY_EDIT_MODE':
      return state.set('categoryEditId', action.id)
    case 'TOGGLE_PRODUCT_EDIT_MODE':
      return state.set('productEditId', action.id)
    case 'TOGGLE_PRODUCT_ITEM_EDIT_MODE':
      return state.set('productItemEditId', action.id)
    case 'TOGGLE_ADD_CATEGORY_MODE':
      return state
        .update('categoryAddMode', item => !item)
        .set('categoryAddParentId', action.parent_id)
    case 'TOGGLE_ADD_PRODUCT_MODE':
      return state.update('productAddMode', item => !item)
    // Selection
    case 'SELECT_PRODUCT':
      return state.set('selectedProductId', action.id)
    case 'SELECT_CATEGORY':
      return state.set('selectedCategoryId', action.id)
    // Categories
    case 'REQUEST_CATEGORIES':
      return state.set('fetchingInitialCategories', true)
    case 'RECEIVE_CATEGORIES':
      return state.set('fetchingInitialCategories', false)
    // Category
    case 'REQUEST_CATEGORY_BY_CATEGORY_ID':
      return state.set('fetchingCategoryById', action.category_id)
    case 'RECEIVE_CATEGORY_BY_CATEGORY_ID':
      return state
        .set('fetchingCategoryById', null)
        .set('alertText', action.error)
    // Subcategories
    case 'REQUEST_SUBCATEGORIES_BY_CATEGORY_ID':
      return state.set('fetchingSubcategoriesByCategoryId', action.category_id)
    case 'RECEIVE_SUBCATEGORIES_BY_CATEGORY_ID':
      return state
        .set('fetchingSubcategoriesByCategoryId', null)
        .set('alertText', action.error)
    case 'RECEIVE_SUBCATEGORIES_BY_CATEGORY_ID_ERROR':
      return state.set('alertText', action.error).set('alertType', 'error')
    // Products
    case 'REQUEST_PRODUCTS_BY_CATEGORY_ID':
      return state.set('fetchingProductsByCategoryId', action.category_id)
    case 'RECEIVE_PRODUCTS_BY_CATEGORY_ID':
      return state
        .set('fetchingProductsByCategoryId', null)
        .set('alertText', action.error)
    case 'RECEIVE_PRODUCTS_BY_CATEGORY_ID_ERROR':
      return state.set('alertText', action.error).set('alertType', 'error')
    // Products
    case 'REQUEST_PRODUCT_BY_PRODUCT_ID':
      return state.set('fetchingProductByProductId', action.category_id)
    case 'RECEIVE_PRODUCT_BY_PRODUCT_ID':
      return state
        .set('fetchingProductByProductId', null)
        .set('alertText', action.error)
    // Search
    case 'SEARCH_LOCAL':
      return state.set('search', action.value)
    case 'RECEIVE_SEARCH_PRODUCTS':
      return state.set('searchProductsResults', fromJS(action.response))
    case 'RECEIVE_SEARCH_PRODUCTS_ERROR':
      return state

    default:
      return state
  }
}

export default ui
