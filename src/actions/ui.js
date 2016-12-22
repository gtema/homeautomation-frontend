// import * as productActions from './products'
import * as categoryActions from './categories'

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
export const toggleAddCategoryMode = () => {
  return {
    type: 'TOGGLE_ADD_CATEGORY_MODE'
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

export const selectProductId = id => (dispatch, getState) => {
  const currentSelectedProductId = getState().ui.get('selectedProductId');
  if (typeof(currentSelectedProductId) !== 'undefined' && currentSelectedProductId !== null ) {
    if (currentSelectedProductId !== id) {
      dispatch(selectProduct(id))
      // dispatch(productActions.requestProductIfNeeded(id))
    }
  } else {
    dispatch(selectProduct(id))
    // dispatch(productActions.requestProductIfNeeded(id))
  }
}

export const selectCategoryId = id => (dispatch, getState) => {
  const currentSelectedCategoryId = getState().ui.get('selectedCategoryId');
  if (typeof(currentSelectedCategoryId) !== 'undefined' && currentSelectedCategoryId !== null ) {
    if (currentSelectedCategoryId !== id) {
      // dispatch(productActions.requestCategoryProductsIfNeeded(id))
      dispatch(categoryActions.loadSubcategoriesIfNeeded(id))
      dispatch(categoryActions.loadCategoryIfNeeded(id))
      dispatch(selectCategory(id))
    }
  } else {
    // dispatch(productActions.requestCategoryProductsIfNeeded(id))
    dispatch(categoryActions.loadSubcategoriesIfNeeded(id))
    dispatch(categoryActions.loadCategoryIfNeeded(id))
    dispatch(selectCategory(id))
  }
}
