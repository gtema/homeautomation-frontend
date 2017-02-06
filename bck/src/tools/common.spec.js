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

  const normalizeFunction = (item) => ({
    id: item.id,
    parent_id: item.parent_id,
    _invalidated: false
  })

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

    const newState = tools.reducerReceiveItems(initState, itemIdKey, itemsParentKey, parentAttributeName, normalizeFunction, false, { response: item, status: 'success' })

    expect(newState.toJSON())
      .toEqual({
        [itemIdKey]: {
          1: normalizeFunction(item)
        },
        [itemsParentKey]: {
          2: {invalidated:false, items:{1:true}}
        }
      })
  })

  it('handles add multiple item to empty state correctly', () => {
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

    const newState = tools.reducerReceiveItems(
        initState,
        itemIdKey,
        itemsParentKey,
        parentAttributeName,
        normalizeFunction,
        false,
        { response: items, status: 'success' })

    expect(newState.toJSON())
      .toEqual({
        [itemIdKey]: {
          1: normalizeFunction(items[0]),
          2: normalizeFunction(items[1])
        },
        [itemsParentKey]: {
          [0]: {invalidated:false, items:{1:true, 2:true}}
        }
      })
  })

  it('handles receiving multiple entities (merge per parent) in non empty placeholder', () => {

    const itemIdKey = 'itemsById'
    const itemsParentKey = 'itemsByParentId'
    const parentAttributeName = 'parent_id'
    const initEmptyState =  Map({
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
      },
      {
        name: 't32',
        parent_id: 1,
        id: 3,
        prio: 0
      },
      {
        name: 't4',
        parent_id: 1,
        id: 4,
        prio: 0
      }
    ]

    const normalizeFunction = (item) => ({
      id: item.id,
      parent_id: item.parent_id,
      name: item.name,
      _invalidated: false
    })

    const initState = tools.reducerReceiveItems(
        initEmptyState,
        itemIdKey,
        itemsParentKey,
        parentAttributeName,
        normalizeFunction,
        false,
        { response: items, status: 'success' })

    const data = [
      {name: 't32',
        parent_id: 1,
        id: 3,
        prio: 0}
      ,{name: 't5',
        parent_id: 1,
        id: 4,
        prio: 0 }
      ,{name: 't6',
        parent_id: 1,
        id: 6,
        prio: 0 }
    ]

    const newState = tools.reducerReceiveItems(
        initState,
        itemIdKey,
        itemsParentKey,
        parentAttributeName,
        normalizeFunction,
        true,
        { response: data, status: 'success', [parentAttributeName]: 1 })

    expect(newState.toJSON())
      .toEqual({
        [itemIdKey]: {
          1: normalizeFunction(items[0]),
          2: normalizeFunction(items[1]),
          3: normalizeFunction(data[0]),
          4: normalizeFunction(data[1]),
          6: normalizeFunction(data[2]),
        },
        [itemsParentKey]: {
          [0]: {invalidated:false, items:{1:true, 2:true}},
          [1]: {invalidated:false, items:{3:true, 4:true, 6:true}},
        }
      })

  });

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

    const initState =  fromJS({
      [itemIdKey]: {
        1: normalizeFunction(items[0]),
        2: normalizeFunction(items[1])
      },
      [itemsParentKey]: {
        [0]: {invalidated:false, items:{1:true, 2:true}}
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
          [0]: {invalidated:false, items:{2:true}}
        }
      })
  })

});
