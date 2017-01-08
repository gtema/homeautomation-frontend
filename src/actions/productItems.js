import { CALL_API, Schemas, Methods } from '../middleware/api'

// Receive bunch of product items - initial data
// export const receiveProductItemsByProductIds = (items, timestamp = Date.now(), err = null) => {
//   return {
//     type: 'RECEIVE_PRODUCT_ITEMS',
//     products: products,
//     status: (err === null ) ? "success":"failure",
//     error: err,
//     timestamp: timestamp || Date.now()
//   }
// }

export const shouldFetchProductItemsByProductId = (state, product_id) => {
  // TODO: check timestamp, last update status, ...
  if ( typeof(state.ui) === 'undefined' || typeof(state.product_items) === 'undefined' ) {
    return true
  }
  // if (category_id !== null && product_id !== state.ui.get('fetchingProductsByCategoryId')) {
    // const productIdsByCategoryId = state.products.getIn(['productsByCategoryId', category_id.toString()])
    // if (typeof(productIdsByCategoryId) === 'undefined') {
      return true;
    // }
  // }
  return false;
}

// export const shouldFetchProduct = (state, product_id) => {
//   // TODO: check timestamp, last update status, ...
//   if ( typeof(state.ui) === 'undefined' || typeof(state.products) === 'undefined' ) {
//     return true
//   }
//   if (product_id !== null && product_id !== 0 && product_id !== state.ui.get('fetchingProductByProductId')) {
//     const product = state.products.getIn(['productsById', product_id.toString()])
//     if (typeof(product) === 'undefined') {
//       return true;
//     }
//
//   }
//   return false;
// }
//
// export const loadProductByProductIdIfNeeded = (parent_id) => {
//   return {
//     [CALL_API] : {
//       types: ['REQUEST_PRODUCT_BY_PRODUCT_ID', 'RECEIVE_PRODUCT_BY_PRODUCT_ID', 'RECEIVE_PRODUCT_BY_PRODUCT_ID_ERROR'],
//       endpoint: `product/${parent_id}`,
//       method: Methods.GET,
//       schema: Schemas.PRODUCT,
//       payload: {parent_id},
//       shouldCallAPI: (state) => shouldFetchProduct(state, parent_id),
//     }
//   }
// }

export const loadProductItemsByProductIdIfNeeded = (parent_id) => {
  return {
    [CALL_API]: {
      types: ['REQUEST_PRODUCT_ITEMS_BY_PRODUCT_ID', 'RECEIVE_PRODUCT_ITEMS_BY_PRODUCT_ID', 'RECEIVE_PRODUCT_ITEMS_BY_PRODUCT_ID_ERROR'],
      endpoint: `product_items_by_product_id/${parent_id}`,
      method: Methods.GET,
      schema: Schemas.PRODUCT_ITEM_ARRAY,
      payload: {product_id: parent_id},
      shouldCallAPI: (state) => shouldFetchProductItemsByProductId(state, parent_id),
    }
  }
}

// Add new product
export const addNewProductItem = ( item ) => {
  return {
    [CALL_API]: {
      types: ['ADD_PRODUCT_ITEM', 'RECEIVE_PRODUCT_ITEM_BY_ID', 'RECEIVE_PRODUCT_ITEM_BY_ID_ERROR'],
      endpoint: `product_item`,
      method: Methods.POST,
      schema: Schemas.PRODUCT_ITEM,
      payload: {product_id: item.product_id, create_date: item.create_date, expiry_date: item.expiry_date},
    }
  }
}

export const modifyProductItem = ( item ) => {
  return {
    [CALL_API]: {
      types: ['MODIFY_PRODUCT_ITEM', 'RECEIVE_PRODUCT_ITEM_BY_ID', 'RECEIVE_PRODUCT_ITEM_BY_ID_ERROR'],
      endpoint: `product_item/${item.id}`,
      method: Methods.PUT,
      schema: Schemas.PRODUCT_ITEM,
      payload: Object.assign({}, item, {}),
    }
  }
}

export const removeProductItemById = ( id ) => {
  return {
    [CALL_API]: {
      types: ['REMOVE_PRODUCT_ITEM', 'DELETE_PRODUCT_ITEM_BY_ID', 'DELETE_PRODUCT_ITEM_BY_ID_ERROR'],
      endpoint: `product_item/${id}`,
      method: Methods.DELETE,
      schema: Schemas.PRODUCT_ITEM,
      payload: {id:id},
    }
  }
}
