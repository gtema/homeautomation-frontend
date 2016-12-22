import { Map } from 'immutable'

const INITIAL_UI_STATE = Map({
  categoryEditId: null,
  productEditId: null,
  productItemEditId: null,
  categoryAddMode: false,
  productAddMode: false,
  alertText: '',
  alertType: '',
  fetchingInitialCategories: true
})


// Categories reducer
const ui = (state = INITIAL_UI_STATE, action) => {
  switch (action.type) {
    case 'TOGGLE_CATEGORY_EDIT_MODE':
      return state.set('categoryEditId', action.id)
    case 'TOGGLE_PRODUCT_EDIT_MODE':
      return state.set('productEditId', action.id)
    case 'TOGGLE_PRODUCT_ITEM_EDIT_MODE':
      return state.set('productItemEditId', action.id)
    case 'TOGGLE_ADD_CATEGORY_MODE':
      return state.update('categoryAddMode', item => !item)
    case 'TOGGLE_ADD_PRODUCT_MODE':
      return state.update('productAddMode', item => !item)
    case 'REQUEST_CATEGORIES':
      return state.set('fetchingInitialCategories', true)
    case 'RECEIVE_CATEGORIES':
      return state.set('fetchingInitialCategories', false)
    case 'REQUEST_CATEGORY_BY_CATEGORY_ID':
      return state.set('fetchingCategoryById', action.category_id)
    case 'RECEIVE_CATEGORY_BY_CATEGORY_ID':
      return state
        .set('fetchingCategoryById', null)
        .set('alertText', action.error)
    case 'REQUEST_SUBCATEGORIES_BY_CATEGORY_ID':
      return state.set('fetchingSubcategoriesByCategoryId', action.category_id)
    case 'RECEIVE_SUBCATEGORIES_BY_CATEGORY_ID':
      return state
        .set('fetchingSubcategoriesByCategoryId', null)
        .set('alertText', action.error)
    case 'REQUEST_PRODUCTS_BY_CATEGORY_ID':
      return state.set('fetchingProductsByCategoryId', action.category_id)
    case 'RECEIVE_PRODUCTS_BY_CATEGORY_ID':
      return state
        .set('fetchingProductsByCategoryId', null)
        .set('alertText', action.error)
    case 'REQUEST_PRODUCT_BY_PRODUCT_ID':
      return state.set('fetchingProductByProductId', action.category_id)
    case 'RECEIVE_PRODUCT_BY_PRODUCT_ID':
      return state
        .set('fetchingProductByProductId', null)
        .set('alertText', action.error)
    case 'SELECT_PRODUCT':
      return state.set('selectedProductId', action.id)
    case 'SELECT_CATEGORY':
      return state.set('selectedCategoryId', action.id)
    default:
      return state
  }
}

export default ui
