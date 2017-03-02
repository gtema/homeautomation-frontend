import configureMockStore	from	'redux-mock-store'
import thunk from	'redux-thunk'
import * as	actions	from	'./products'
import nock	from	'nock'

import api from '../middleware/api'
import { API_HOST, API_PATH, API_KEY } from '../tools/constants'

import { fromJS, Map, List } from 'immutable'

const	middlewares	=	[	thunk, api ]
const	mockStore	=	configureMockStore(middlewares)

describe('products actions', () => {

 afterEach(()	=>	{
  nock.cleanAll()
 });

 it('shouldFetchProduct', () => {
  const iniState = {
   products: fromJS({
    productsById: {1:{"id":1}},
   }),
   ui: fromJS({
    fetchingProductByProductId: 3
   })
  }

  expect(actions.shouldFetchProduct(iniState, 1)).toEqual(false)
  expect(actions.shouldFetchProduct(iniState, 2)).toEqual(true)
  expect(actions.shouldFetchProduct(iniState, 3)).toEqual(false)
 });

 it('handles success REQUEST_PRODUCT_BY_PRODUCT_ID', () => {

  let product = {id: 3, name: 'test', parent_id: 1};
  nock(`http://${API_HOST}`)
   .get(`${API_PATH}product/${product.id}`)
   .reply(200, product);

  const timestamp = Date.now()
  const expectedActions = [
   { type: 'REQUEST_PRODUCT_BY_PRODUCT_ID', product_id: product.id },
   { type: 'RECEIVE_PRODUCT_BY_PRODUCT_ID', response: product, product_id: product.id, status: 'success', timestamp: timestamp }
  ]

  const store = mockStore({})

  return store.dispatch(actions.loadProductByProductIdIfNeeded(product.id))
   .then(() => {
    expect(fromJS(store.getActions()).updateIn([1, 'timestamp'], item => timestamp).toJSON()).toEqual(expectedActions)
   })
 });

 it('handles failure REQUEST_PRODUCT_BY_PRODUCT_ID', () => {

  let product = {id: 3, name: 'test', parent_id: 1};
  nock(`http://${API_HOST}`)
   .get(`${API_PATH}product/${product.id}`)
   .reply(404, {message: "ups"});

  const timestamp = Date.now()
  const expectedActions = [
   { type: 'REQUEST_PRODUCT_BY_PRODUCT_ID', product_id: product.id },
   { type: 'RECEIVE_PRODUCT_BY_PRODUCT_ID_ERROR', product_id: product.id, status: 'failure', error: 'ups', timestamp: timestamp }
  ]

  const store = mockStore({})

  return store.dispatch(actions.loadProductByProductIdIfNeeded(product.id))
   .then(() => {
    expect(fromJS(store.getActions()).updateIn([1, 'timestamp'], item => timestamp).toJSON()).toEqual(expectedActions)
   })
 });

 it('shouldFetchProductsByCategoryId', () => {
  const iniState = {
   products: fromJS({
    productsById: {1:{"id":1}},
    productsByCategoryId: {0:{invalidated:false, items:{1:true}}}
   }),
   ui: fromJS({
    fetchingProductsByCategoryId: 3
   })
  }

  expect(actions.shouldFetchProductsByCategoryId(iniState, 0)).toEqual(false)
  expect(actions.shouldFetchProductsByCategoryId(iniState, 2)).toEqual(true)
  expect(actions.shouldFetchProductsByCategoryId(iniState, 3)).toEqual(false)
 });

 it('handles success REQUEST_PRODUCTS_BY_CATEGORY_ID', () => {

  let products = [
   {id: 3, name: 'test', category_id: 1},
   {id: 4, name: 'test2', category_id: 1}
  ]

  nock(`http://${API_HOST}`)
   .get(`${API_PATH}products_by_category_id/${products[0].category_id}`)
   .reply(200, products);

  const timestamp = Date.now()
  const expectedActions = [
   { type: 'REQUEST_PRODUCTS_BY_CATEGORY_ID', category_id: products[0].category_id },
   { type: 'RECEIVE_PRODUCTS_BY_CATEGORY_ID', category_id: products[0].category_id, response : products, status: 'success', timestamp: timestamp }
  ]

  const store = mockStore({})

  return store.dispatch(actions.loadProductsByCategoryIdIfNeeded(products[0].category_id))
   .then(() => {
    expect(fromJS(store.getActions()).updateIn([1, 'timestamp'], item => timestamp).toJSON()).toEqual(expectedActions)
   })
 });

 it('handles failure REQUEST_PRODUCTS_BY_CATEGORY_ID', () => {

  let products = [
   {id: 3, name: 'test', category_id: 1},
   {id: 4, name: 'test2', category_id: 1}
  ]
  nock(`http://${API_HOST}`)
   .get(`${API_PATH}products_by_category_id/${products[0].category_id}`)
   .replyWithError('Server error');

  const timestamp = Date.now()
  const expectedActions = [
   { type: 'REQUEST_PRODUCTS_BY_CATEGORY_ID', category_id: products[0].category_id },
   { type: 'RECEIVE_PRODUCTS_BY_CATEGORY_ID_ERROR', category_id: products[0].category_id, status: 'failure', error:
     `request to http://${API_HOST}${API_PATH}products_by_category_id/${products[0].category_id} failed, reason: Server error`, timestamp: timestamp }
  ]

  const store = mockStore({})

  return store.dispatch(actions.loadProductsByCategoryIdIfNeeded(products[0].category_id))
   .then(() => {
    expect(fromJS(store.getActions()).updateIn([1, 'timestamp'], item => timestamp).toJSON()).toEqual(expectedActions)
   })
 });
 // TODO:
 // add, modify, delete product actions
});
