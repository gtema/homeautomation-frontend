// import * as productActions from './products'
import * as categoryActions from './categories'
import { CALL_API, Schemas, Methods } from '../middleware/api'

// Switch category edit mode
export const toggleCategoryEditMode = (catId) => {
  return {
    type: 'TOGGLE_CATEGORY_EDIT_MODE',
    id: catId
  }
}

// Switch product edit mode
export const toggleProductEditMode = (prodId) => {
  return {
    type: 'TOGGLE_PRODUCT_EDIT_MODE',
    id: prodId
  }
}

// Switch product item edit mode
export const toggleProductItemEditMode = (id) => {
  return {
    type: 'TOGGLE_PRODUCT_ITEM_EDIT_MODE',
    id: id
  }
}

// Switch product edit mode
export const toggleAddCategoryMode = (parent_id) => {
  return {
    type: 'TOGGLE_ADD_CATEGORY_MODE',
    parent_id: parent_id,
  }
}

// Switch product edit mode
export const toggleAddProductMode = () => {
  return {
    type: 'TOGGLE_ADD_PRODUCT_MODE'
  }
}

// Switch product edit mode
export const selectProduct = id => {
  return {
    type: 'SELECT_PRODUCT',
    id: id
  }
}

// Switch product edit mode
export const selectCategory = id => {
  return {
    type: 'SELECT_CATEGORY',
    id: id
  }
}

// Search
export const search = value => (dispatch, getState) => {
  dispatch({
    type: 'SEARCH_LOCAL',
    value: value
  })
  /**
    Fire a API request to get products with the NAME containing search value

    It is of course possible to do a local search only, and this is even done for
    categories (they are all loaded), but lots of products might not be loaded yet.
    Therefore each time a search changes we will fire an API request to get matching
    products. Search results will be stored in the UI part of the state and
    will NOT be merged/updated in the real app state.
  */
  if (typeof(value) !== 'undefined' && value !== null && value.length > 2) {
    // Do a remote search only if search token length is more than 2
    dispatch({
      [CALL_API] : {
        types: ['REQUEST_SEARCH_PRODUCTS', 'RECEIVE_SEARCH_PRODUCTS', 'RECEIVE_SEARCH_PRODUCTS_ERROR'],
        endpoint: `products?name=${value}`,
        method: Methods.GET,
        schema: Schemas.PRODUCT_ARRAY,
        payload: {value},
      }
    })
  }
}

export const selectProductId = id => (dispatch, getState) => {
  const currentSelectedProductId = getState().ui.get('selectedProductId');
  if (typeof(currentSelectedProductId) !== 'undefined' && currentSelectedProductId !== null ) {
    if (currentSelectedProductId !== id) {
      dispatch(selectProduct(id))
    }
  } else {
    dispatch(selectProduct(id))
  }
}

/* Request all individual catalogue elements if necessary */
export const selectCategoryId = id => (dispatch, getState) => {
  const currentSelectedCategoryId = getState().ui.get('selectedCategoryId');
  if (typeof(currentSelectedCategoryId) !== 'undefined' && currentSelectedCategoryId !== null ) {
    if (currentSelectedCategoryId !== id) {
      dispatch(categoryActions.loadSubcategoriesIfNeeded(id))
      dispatch(categoryActions.loadCategoryIfNeeded(id))
      dispatch(selectCategory(id))
    }
  } else {
    dispatch(categoryActions.loadSubcategoriesIfNeeded(id))
    dispatch(categoryActions.loadCategoryIfNeeded(id))
    dispatch(selectCategory(id))
  }
}
