import { CALL_API, Schemas, Methods } from '../middleware/api'

// Receive bunch of products - initial data
export const receiveProductByProductIds = (products, timestamp = Date.now(), err = null) => {
  return {
    type: 'RECEIVE_PRODUCTS',
    products: products,
    status: (err === null ) ? "success":"failure",
    error: err,
    timestamp: timestamp || Date.now()
  }
}

// Check if products for the given category should be re/-fetched
export const shouldFetchProductsByCategoryId = (state, category_id) => {
  // TODO: check timestamp, last update status, ...
  if ( typeof(state.ui) === 'undefined' || typeof(state.products) === 'undefined' ) {
    return true
  }
  if (category_id !== null && category_id !== state.ui.get('fetchingProductsByCategoryId')) {
    const productIdsByCategoryId = state.products.getIn(['productsByCategoryId', category_id.toString()])
    /* If we do not have a group, or it is invalidated - refetch */
    if (typeof(productIdsByCategoryId) === 'undefined' || productIdsByCategoryId.get('invalidated') === true) {
      return true;
    }
    /* If any known product in the category is invalidated - refetch complete group */
    const list = productIdsByCategoryId.get('items').keySeq()
      .map(item => state.products.getIn(['productsById', item.toString(), '_invalidated']))
      .filter(item => item)
      .toArray()
    if (typeof(list) !== 'undefined' && list.length > 0 && list[0] === true) {
      console.debug("refetching due to the product invalidation")
      return true
    }
  }
  console.log("not refetching products by category")
  return false
}

// Check if product should be re/-fetched
export const shouldFetchProduct = (state, product_id) => {
  // TODO: check timestamp, last update status, ...
  if (product_id === -1) {
    return false
  }
  if ( typeof(state.ui) === 'undefined' || typeof(state.products) === 'undefined' ) {
    return true
  }
  if (product_id !== null && product_id !== 0 && product_id !== state.ui.get('fetchingProductByProductId')) {
    const product = state.products.getIn(['productsById', product_id.toString()])
    if (typeof(product) === 'undefined') {
      return true;
    }
    if (product.get('_invalidated')) {
      console.debug("Product is invalidated - refetching")
      return true
    }

  }
  return false
}

// Load individual product if required
export const loadProductByProductIdIfNeeded = (product_id) => {
  return {
    [CALL_API] : {
      types: ['REQUEST_PRODUCT_BY_PRODUCT_ID', 'RECEIVE_PRODUCT_BY_PRODUCT_ID', 'RECEIVE_PRODUCT_BY_PRODUCT_ID_ERROR'],
      endpoint: `product/${product_id}`,
      method: Methods.GET,
      schema: Schemas.PRODUCT,
      payload: {product_id},
      shouldCallAPI: (state) => shouldFetchProduct(state, product_id),
    }
  }
}

// Load products if required
export const loadProductsByCategoryIdIfNeeded = (category_id) => {
  return {
    [CALL_API]: {
      types: ['REQUEST_PRODUCTS_BY_CATEGORY_ID', 'RECEIVE_PRODUCTS_BY_CATEGORY_ID', 'RECEIVE_PRODUCTS_BY_CATEGORY_ID_ERROR'],
      endpoint: `products_by_category_id/${category_id}`,
      method: Methods.GET,
      schema: Schemas.PRODUCT_ARRAY,
      payload: {category_id},
      shouldCallAPI: (state) => shouldFetchProductsByCategoryId(state, category_id),
    }
  }
}

// Add new product
export const addNewProduct = ( name, id ) => {
  return {
    [CALL_API]: {
      types: ['ADD_PRODUCT', 'RECEIVE_PRODUCT_BY_PRODUCT_ID', 'RECEIVE_PRODUCT_BY_PRODUCT_ID_ERROR'],
      endpoint: `product`,
      method: Methods.POST,
      schema: Schemas.PRODUCT,
      payload: {name: name, category_id: id},
    }
  }
}

// Modify product
export const modifyProduct = ( item ) => {
  return {
    [CALL_API]: {
      types: ['MODIFY_PRODUCT', 'RECEIVE_PRODUCT_BY_PRODUCT_ID', 'RECEIVE_PRODUCT_BY_PRODUCT_ID_ERROR'],
      endpoint: `product/${item.id}`,
      method: Methods.PUT,
      schema: Schemas.PRODUCT,
      payload: Object.assign({}, item, {}),
    }
  }
}

// Remove product
export const removeProductByProductId = ( id ) => {
  return {
    [CALL_API]: {
      types: ['REMOVE_PRODUCT', 'DELETE_PRODUCT_BY_ID', 'DELETE_PRODUCT_BY_ID_ERROR'],
      endpoint: `product/${id}`,
      method: Methods.DELETE,
      schema: Schemas.PRODUCT,
      payload: {id:id},
    }
  }
}
