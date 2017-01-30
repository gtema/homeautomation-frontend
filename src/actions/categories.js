import { CALL_API, Schemas, Methods } from '../middleware/api'

// Receive bunch of categories (initial state)
export const receiveCategories = (ignore, cats, timestamp = Date.now(), err = null) => {
  return {
    type: 'RECEIVE_CATEGORIES',
    categories: cats,
    status: (err === null ) ? "success":"failure",
    error: err,
    timestamp: timestamp || Date.now()
  }
}

export const shouldFetchSubcategories = (state, category_id) => {
  // TODO: check timestamp, last update status, ...
  if ( typeof(state.ui) === 'undefined' || typeof(state.categories) === 'undefined'
    || state.categories.get('categoriesById').size === 0) {
    return true
  }
  if (category_id !== null && category_id !== state.ui.get('fetchingSubcategoriesByCategoryId') && ! state.ui.get('fetchingInitialCategories')) {
    const subcategoryIds = state.categories.getIn(['categoriesByGroupId', category_id.toString()])
    if (typeof subcategoryIds === 'undefined') {
      return true
    }

  }

  return false;
}

export const shouldFetchCategory = (state, category_id) => {
  // TODO: check timestamp, last update status, ...
  if ( typeof(state.ui) === 'undefined' || typeof(state.categories) === 'undefined' ) {
    return true
  }
  if (category_id !== null && category_id !== 0  && ! state.ui.get('fetchingInitialCategories')) {
    const category = state.categories.getIn(['categoriesById', category_id.toString()])
    if (typeof category === 'undefined') {
      return true
    }

  }

  return false;
}

export const loadSubcategoriesIfNeeded = (category_id) => {
  return {
    [CALL_API]: {
      types: ['REQUEST_SUBCATEGORIES_BY_CATEGORY_ID', 'RECEIVE_SUBCATEGORIES_BY_CATEGORY_ID', 'RECEIVE_SUBCATEGORIES_BY_CATEGORY_ID_ERROR'],
      endpoint: `categories_by_category_id/${category_id}`,
      method: Methods.GET,
      schema: Schemas.CATEGORY_ARRAY,
      payload: {parent_id:category_id},
      shouldCallAPI: (state) => shouldFetchSubcategories(state, category_id),
    }
  }
}

export const loadAllCategories = () => {
  return {
    [CALL_API] : {
      types: ['REQUEST_CATEGORIES', 'RECEIVE_CATEGORIES', 'RECEIVE_CATEGORIES_ERROR'],
      endpoint: `categories`,
      method: Methods.GET,
      schema: Schemas.CATEGORY_ARRAY,
    }
  }
}

export const loadCategoryIfNeeded = (id) => {
  return {
    [CALL_API] : {
      types: ['REQUEST_CATEGORY_BY_CATEGORY_ID', 'RECEIVE_CATEGORY_BY_CATEGORY_ID', 'RECEIVE_CATEGORY_BY_CATEGORY_ID_ERROR'],
      endpoint: `category/${id}`,
      method: Methods.GET,
      schema: Schemas.CATEGORY,
      payload: {parent_id:id},
      shouldCallAPI: (state) => shouldFetchCategory(state, id),
    }
  }
}

// Add new product
export const addNewCategory = ( name, parent_id ) => {
  return {
    [CALL_API]: {
      types: ['ADD_CATEGORY', 'RECEIVE_CATEGORY_BY_CATEGORY_ID', 'RECEIVE_CATEGORY_BY_CATEGORY_ID_ERROR'],
      endpoint: `category`,
      method: Methods.POST,
      schema: Schemas.CATEGORY,
      payload: {name: name, parent_id: parent_id},
    }
  }
}

export const modifyCategory = ( item ) => {
  return {
    [CALL_API]: {
      types: ['MODIFY_CATEGORY', 'RECEIVE_CATEGORY_BY_CATEGORY_ID', 'RECEIVE_CATEGORY_BY_CATEGORY_ID_ERROR'],
      endpoint: `category/${item.id}`,
      method: Methods.PUT,
      schema: Schemas.CATEGORY,
      payload: Object.assign({}, item, {}),
    }
  }
}

export const removeCategoryByCategoryId = ( id ) => {
  return {
    [CALL_API]: {
      types: ['REMOVE_CATEGORY', 'DELETE_CATEGORY_BY_CATEGORY_ID', 'DELETE_CATEGORY_BY_CATEGORY_ID_ERROR'],
      endpoint: `category/${id}`,
      method: Methods.DELETE,
      schema: Schemas.CATEGORY,
      payload: {id:id},
    }
  }
}
