import	configureMockStore	from	'redux-mock-store'
import	thunk	from	'redux-thunk'
import	*	as	actions	from	'./categories'
import	nock	from	'nock'
import { Map, fromJS } from 'immutable'

import { API_HOST, API_PATH, API_KEY } from '../tools/constants'

import api from '../middleware/api'

const	middlewares	=	[	thunk, api ]
const	mockStore	=	configureMockStore(middlewares)

describe('products actions', () => {

  afterEach(()	=>	{
    nock.cleanAll()
  });

  it('handles success REQUEST_CATEGORY_BY_CATEGORY_ID', () => {

    let category = {id: 3, name: 'test', parent_id: 1}
    nock(`http://${API_HOST}`)
      .get(`${API_PATH}category/${category.id}`)
      .reply(200, category);

    const timestamp = Date.now()
    const expectedActions = [
      { type: 'REQUEST_CATEGORY_BY_CATEGORY_ID', parent_id: category.id },
      { type: 'RECEIVE_CATEGORY_BY_CATEGORY_ID', authenticated: true, response : category, parent_id: category.id, status: 'success', timestamp: timestamp }
    ]

    const store = mockStore({})

    return store.dispatch(actions.loadCategoryIfNeeded(category.id))
      .then(() => {
        expect(fromJS(store.getActions()).updateIn([1, 'timestamp'], item => timestamp).toJSON()).toEqual(expectedActions)
      })

  });

  it('handles error REQUEST_CATEGORY_BY_CATEGORY_ID', () => {

    let category = {id: 3, name: 'test', parent_id: 1}
    nock(`http://${API_HOST}`)
      .get(`${API_PATH}category/${category.id}`)
      .reply(401, {message: "ups"});

    const timestamp = Date.now()
    const expectedActions = [
      { type: 'REQUEST_CATEGORY_BY_CATEGORY_ID', parent_id: category.id },
      { type: 'RECEIVE_CATEGORY_BY_CATEGORY_ID_ERROR', authenticated: true, parent_id: category.id, status: 'failure', error: "ups", timestamp: timestamp }
    ]

    const store = mockStore({})

    return store.dispatch(actions.loadCategoryIfNeeded(category.id))
      .then(() => {
        expect(fromJS(store.getActions()).updateIn([1, 'timestamp'], item => timestamp).toJSON()).toEqual(expectedActions)
      })

  });

  it('handles success REQUEST_SUBCATEGORIES_BY_CATEGORY_ID', () => {

    let categories = [
      {id: 3, name: 'test', parent_id: 1},
      {id: 4, name: 'test2', parent_id: 1}
    ]
    nock(`http://${API_HOST}`)
      .get(`${API_PATH}categories_by_category_id/${categories[0].parent_id}`)
      .reply(200, categories);

    const timestamp = Date.now()
    const expectedActions = [
      { type: 'REQUEST_SUBCATEGORIES_BY_CATEGORY_ID', parent_id: categories[0].parent_id },
      { type: 'RECEIVE_SUBCATEGORIES_BY_CATEGORY_ID', authenticated: true, parent_id: categories[0].parent_id, response: categories, status: 'success', timestamp: timestamp }
    ]

    const store = mockStore({})

    return store.dispatch(actions.loadSubcategoriesIfNeeded(categories[0].parent_id))
      .then(() => {
        expect(fromJS(store.getActions()).updateIn([1, 'timestamp'], item => timestamp).toJSON()).toEqual(expectedActions)
      })
  });

  it('handles RECEIVE_CATEGORIES with bunch of categories', () => {
    let categories = [
      {id: 3, name: 'test', parent_id: 1},
      {id: 4, name: 'test2', parent_id: 1}
    ]
    nock(`http://${API_HOST}`)
      .get(`${API_PATH}categories`)
      .reply(200, categories);
    const timestamp = Date.now()

    const expectedActions = [
      { type: 'REQUEST_CATEGORIES' },
      { type: 'RECEIVE_CATEGORIES', authenticated: true, response: categories, status: 'success', timestamp: timestamp }
    ]

    const store = mockStore({auth: {isAuthenticated: true}})

    return store.dispatch(actions.loadAllCategories())
      .then(() => {
        expect(fromJS(store.getActions()).updateIn([1, 'timestamp'], item => timestamp).toJSON()).toEqual(expectedActions)
      })
  })

  //TODO:
  // - add, modify, delete category actions

});
