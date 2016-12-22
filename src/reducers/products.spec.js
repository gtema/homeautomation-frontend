import products from './products'
import { Map, List, fromJS } from 'immutable'

const productTree = [
  {name: 't1',
    category_id: '0',
    id: '1' }
  ,{name: 't2',
    category_id: '0',
    id: '2' }
  ,{name: 't3',
    category_id: '1',
    id: '3' }
  ,{name: 't4',
    category_id: '1',
    id: '4' }
  ,{name: 't5',
    category_id: '1',
    id: '5' }
]

describe('products reducer', () => {

  it('should handle initial state', () => {
    const nextState = products(undefined, {})
    expect(nextState).toEqual(
      fromJS({
        productsById:{},
        productsByCategoryId:{},
      })
    )
  });

  it('should handle ADD_PRODUCT with single product', () => {
    const prods =
      {
        name: 'Run the tests',
        category_id: '0',
        id: '1'
      }

    const action = {
      type: 'ADD_PRODUCT',
      response: prods,
      status: 'success'
    }

    const nextState = products(undefined, action)

    expect(nextState.get('productsById').toJSON()).toEqual(
      {
        1:prods
      }
    )
    expect(nextState.get('productsByCategoryId').toJSON()).toEqual(
      {
        0:{1:true}
      }
    )
  });

  it('should handle ADD_PRODUCT with multiple products', () => {
    const action = {
      type: 'ADD_PRODUCT',
      response: productTree,
      status: 'success'
    }
    const nextState = products(undefined, action)
    expect(nextState.get('productsById').toJSON()).toEqual(
      { 1:productTree[0], 2:productTree[1], 3:productTree[2], 4:productTree[3], 5:productTree[4] }
    )
    expect(nextState.get('productsByCategoryId').toJSON()).toEqual(
      { 0:{1:true, 2:true}, 1:{3:true, 4:true, 5:true} }
    )
  });

  it('should handle RECEIVE_PRODUCTS_BY_CATEGORY_ID with multiple product', () => {
    const initState = products(undefined, { type: 'ADD_PRODUCT', response: productTree, status: 'success' })

    const receiveProds = [
      {name: 't31',
        category_id: '1',
        id: '3' }
      ,{name: 't5',
        category_id: '1',
        id: '5' }
      ,{name: 't6',
        category_id: '1',
        id: '6' }
    ]
    const timestamp = Date.now()
    const successAction = {
      type: 'RECEIVE_PRODUCTS_BY_CATEGORY_ID',
      status: 'success',
      category_id: '1',
      timestamp: timestamp,
      response: receiveProds
    }

    const nextState = products(initState, successAction)
    const productsById = nextState.get('productsById')
    const productsByCategoryId = nextState.get('productsByCategoryId')
    const expectedProductByIds = fromJS({ 1:productTree[0], 2:productTree[1], 3:receiveProds[0], 5:receiveProds[1], 6:receiveProds[2] })
    const expectedProductByCategoryIds = fromJS({ 0:{1:true, 2:true}, 1:{3:true, 5:true, 6:true} })

    expect(productsById.toJSON()).toEqual(
      expectedProductByIds.toJSON()
    )

    expect(productsByCategoryId.toJSON()).toEqual(
      expectedProductByCategoryIds.toJSON()
    )

    // expect(nextState.get('info').toJSON()).toEqual({0:{'lastUpdateStatus':'success'},1:{'lastUpdateStatus':'success', 'lastSynchronizeTime': timestamp}})
  });

  it('should leave state products unmodified after failure in RECEIVE_PRODUCS', () => {
    const initState = products(undefined, { type: 'ADD_PRODUCT', response: productTree, status: 'success' })

    const receiveProds = [
      {name: 't31',
        category_id: '1',
        id: '3' }
    ]

    const faultAction = {
      type: 'RECEIVE_PRODUCTS_BY_CATEGORY_ID',
      status: 'failure',
      timestamp: Date.now(),
      response: receiveProds
    }

    const faileState = products(initState, faultAction)

    expect(faileState.get('productsById').toJSON()).toEqual(initState.get('productsById').toJSON())
    expect(faileState.get('productsByCategoryId').toJSON()).toEqual(initState.get('productsByCategoryId').toJSON())

  });

  it('should remove product from the state', () => {
    const initState = products(undefined, { type: 'ADD_PRODUCT', response: productTree, status: 'success' })

    const deleteIdx = 3

    const deleteId = productTree[deleteIdx].id

    const action = {
      type: 'DELETE_PRODUCT_BY_ID',
      id: deleteId
    }

    const nextState = products(initState, action)

    expect(nextState.get('productsById').toJSON()).toEqual(initState.get('productsById').delete(deleteId).toJSON())
    expect(nextState.get('productsByCategoryId').toJSON()).toEqual(initState.get('productsByCategoryId').deleteIn([productTree[deleteIdx].category_id, deleteId]).toJSON())

  });

})
