import categories from './categories'
import { Map, List, fromJS } from 'immutable'
import {findItemsInANotPresentInB} from './categories'

const categoryTree = [
  {name: 't1',
    parent_id: 0,
    id: 1 }
  ,{name: 't2',
    parent_id: 0,
    id: 2 }
  ,{name: 't3',
    parent_id: 1,
    id: 3 }
  ,{name: 't4',
    parent_id: 1,
    id: 4 }
  ,{name: 't5',
    parent_id: 1,
    id: 5 }
]

describe('categories reducer', () => {

  it('should handle initial state', () => {
    const nextState = categories(undefined, {})
    expect(nextState).toEqual(
      fromJS({
        categoriesById:{},
        categoriesByGroupId:{},
      })
    )
  });

  it('should handle RECEIVE_CATEGORIES', () => {
    const action = {
      type: 'RECEIVE_CATEGORIES',
      response: categoryTree,
      status: 'success'
    }
    const nextState = categories(undefined, action)
    expect(nextState.get('categoriesById').toJSON())
      .toEqual({ 1:categoryTree[0], 2:categoryTree[1], 3:categoryTree[2], 4:categoryTree[3], 5:categoryTree[4] })

    expect(nextState.get('categoriesByGroupId').toJSON())
      .toEqual({ 0:{1:true, 2:true}, 1:{3:true, 4:true, 5:true} })
  });

  // it('test for findItemsInANotPresentInB', () => {
  //   expect(findItemsInANotPresentInB([3,4,5], [3,5,6])).toEqual([4])
  // })

  it('should handle RECEIVE_SUBCATEGORIES_BY_CATEGORY_ID', () => {
    const initState = categories(undefined, {type:'RECEIVE_CATEGORIES', response:categoryTree, status: 'success'});

    const cats = [
      {name: 't32',
        parent_id: 1,
        id: 3 }
      ,{name: 't5',
        parent_id: 1,
        id: 5 }
      ,{name: 't6',
        parent_id: 1,
        id: 6 }
    ]

    const action = {
      type: 'RECEIVE_SUBCATEGORIES_BY_CATEGORY_ID',
      response: cats,
      parent_id: '1',
      timestamp: Date.now(),
      status: 'success'
    }

    const nextState = categories(initState, action)

    expect(nextState.get('categoriesById').toJSON())
      .toEqual({ 1:categoryTree[0], 2:categoryTree[1], 3:cats[0], 5:cats[1], 6:cats[2] })

    expect(nextState.get('categoriesByGroupId').toJSON())
      .toEqual({ 0:{1:true, 2:true}, 1:{3:true, 5:true, 6:true} })
  });

  it('should handle REMOVE_CATEGORY_BY_ID', () => {
    const initState = categories(undefined, {type:'RECEIVE_CATEGORIES', response:categoryTree, status: 'success'});

    const action = {
      type: 'DELETE_CATEGORY_BY_CATEGORY_ID',
      id: 5,
    }

    const nextState = categories(initState, action)

    expect(nextState.get('categoriesById').toJSON())
      .toEqual({ 1:categoryTree[0], 2:categoryTree[1], 3:categoryTree[2], 4:categoryTree[3] })

    expect(nextState.get('categoriesByGroupId').toJSON())
      .toEqual({ 0:{1:true, 2:true}, 1:{3:true, 4:true} })

  });

})
