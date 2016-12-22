import ui from './ui'
import { Map, List, fromJS } from 'immutable'
import { receiveCategoryProducts } from '../actions/products'

const categoryTree = [
  {name: 't1',
    parent_id: '0',
    id: '1' }
  ,{name: 't2',
    parent_id: '0',
    id: '2' }
  ,{name: 't3',
    parent_id: '1',
    id: '3' }
  ,{name: 't4',
    parent_id: '1',
    id: '4' }
  ,{name: 't5',
    parent_id: '1',
    id: '5' }
]

describe('ui reducer', () => {

  it('should handle initial state', () => {
    const nextState = ui(undefined, {})
    expect(nextState).not.toBeNull()
  });

  it('should handle TOGGLE_CATEGORY_EDIT_MODE', () => {
    const initState = ui(undefined, {})
    var nextState = ui(initState, {type:'TOGGLE_CATEGORY_EDIT_MODE', id:4})
    expect(nextState.get('categoryEditId')).toEqual(4)
    nextState = ui(nextState, {type:'TOGGLE_CATEGORY_EDIT_MODE', id:null})
    expect(nextState.get('categoryEditId')).toEqual(null)
  });

  it('should handle TOGGLE_PRODUCT_EDIT_MODE', () => {
    const initState = ui(undefined, {})
    var nextState = ui(initState, {type:'TOGGLE_PRODUCT_EDIT_MODE', id:4})
    expect(nextState.get('productEditId')).toEqual(4)
    nextState = ui(nextState, {type:'TOGGLE_PRODUCT_EDIT_MODE', id:null})
    expect(nextState.get('productEditId')).toEqual(null)
  });

  it('should handle TOGGLE_ADD_CATEGORY_MODE', () => {
    const initState = ui(undefined, {})
    expect(initState.get('categoryAddMode')).toEqual(false)
    var nextState = ui(initState, {type:'TOGGLE_ADD_CATEGORY_MODE'})
    expect(nextState.get('categoryAddMode')).toEqual(true)
    nextState = ui(nextState, {type:'TOGGLE_ADD_CATEGORY_MODE'})
    expect(nextState.get('categoryAddMode')).toEqual(false)
  });

  it('should handle TOGGLE_ADD_PRODUCT_MODE', () => {
    const initState = ui(undefined, {})
    expect(initState.get('productAddMode')).toEqual(false)
    var nextState = ui(initState, {type:'TOGGLE_ADD_PRODUCT_MODE'})
    expect(nextState.get('productAddMode')).toEqual(true)
    nextState = ui(nextState, {type:'TOGGLE_ADD_PRODUCT_MODE'})
    expect(nextState.get('productAddMode')).toEqual(false)
  });

})
