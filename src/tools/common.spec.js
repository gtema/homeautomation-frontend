import	configureMockStore	from	'redux-mock-store'
import	thunk	from	'redux-thunk'
import	nock	from	'nock'
import { Map, fromJS } from 'immutable'

import * as tools from './common'

const	middlewares	=	[	thunk	]
const	mockStore	=	configureMockStore(middlewares)

describe('commons', () => {

  afterEach(()	=>	{
    nock.cleanAll()
  });

  it('handles add single item to empty state correctly', () => {
    const itemIdKey = 'itemsById'
    const itemsParentKey = 'itemsByParentId'
    const parentAttributeName = 'parent_id'
    const initState =  Map({
      [itemIdKey]: Map(),
      [itemsParentKey]: Map()
    })

    const item = {
      id:1,
      parent_id:2
    }

    const normalizeFunction = (item) => ({
      id: item.id,
      parent_id: item.parent_id
    })

    const newState = tools.reducerReceiveItems(initState, itemIdKey, itemsParentKey, parentAttributeName, normalizeFunction, false, { response: item, status: 'success' })

    expect(newState.toJSON())
      .toEqual({
        [itemIdKey]: {
          1: normalizeFunction(item)
        },
        [itemsParentKey]: {
          2: {1:true}
        }
      })
  })

  it('handles add multiplse item to empty state correctly', () => {
    const itemIdKey = 'itemsById'
    const itemsParentKey = 'itemsByParentId'
    const parentAttributeName = 'parent_id'
    const initState =  Map({
      [itemIdKey]: Map(),
      [itemsParentKey]: Map()
    })

    const items = [
      {
        id:1,
        parent_id:0,
        x:3
      },
      {
        id:2,
        parent_id:0
      }
    ]

    const normalizeFunction = (item) => ({
      id: item.id,
      parent_id: item.parent_id
    })

    const newState = tools.reducerReceiveItems(initState, itemIdKey, itemsParentKey, parentAttributeName, normalizeFunction, false, { response: items, status: 'success' })

    expect(newState.toJSON())
      .toEqual({
        [itemIdKey]: {
          1: normalizeFunction(items[0]),
          2: normalizeFunction(items[1])
        },
        [itemsParentKey]: {
          [0]: {1:true, 2:true}
        }
      })
  })

  it('handles delete item correctly', () => {
    const itemIdKey = 'itemsById'
    const itemsParentKey = 'itemsByParentId'
    const parentAttributeName = 'parent_id'

    const items = [
      { id:1,
        parent_id:0,
      },
      { id:2,
        parent_id:0,
      }]

    const normalizeFunction = (item) => ({
      id: item.id,
      parent_id: item.parent_id
    })

    const initState =  fromJS({
      [itemIdKey]: {
        1: normalizeFunction(items[0]),
        2: normalizeFunction(items[1])
      },
      [itemsParentKey]: {
        [0]: {1:true, 2:true}
      }
    })

    const newState = tools.reducerRemoveItem(initState, itemIdKey, itemsParentKey, parentAttributeName, 1)

    expect(newState.toJSON())
      .toEqual({
        [itemIdKey]: {
          // 1: normalizeFunction(items[0]),
          2: normalizeFunction(items[1])
        },
        [itemsParentKey]: {
          [0]: { 2:true}
        }
      })
  })

});
