import ui from './ui'
import { fromJS } from 'immutable'

describe('ui reducer', () => {

  it('should handle initial state', () => {
    const nextState = ui(undefined, {})
    expect(nextState).not.toBeNull()
  })

  it('should handle TOGGLE_CATEGORY_EDIT_MODE', () => {
    const initState = ui(undefined, {})
    var nextState = ui(initState, {type:'TOGGLE_CATEGORY_EDIT_MODE', id:4})
    expect(nextState.get('categoryEditId')).toEqual(4)
    nextState = ui(nextState, {type:'TOGGLE_CATEGORY_EDIT_MODE', id:null})
    expect(nextState.get('categoryEditId')).toEqual(null)
  })

  it('should handle TOGGLE_PRODUCT_EDIT_MODE', () => {
    const initState = ui(undefined, {})
    var nextState = ui(initState, {type:'TOGGLE_PRODUCT_EDIT_MODE', id:4})
    expect(nextState.get('productEditId')).toEqual(4)
    nextState = ui(nextState, {type:'TOGGLE_PRODUCT_EDIT_MODE', id:null})
    expect(nextState.get('productEditId')).toEqual(null)
  })

  it('should handle TOGGLE_ADD_CATEGORY_MODE', () => {
    const initState = ui(undefined, {})
    expect(initState.get('categoryAddMode')).toEqual(false)
    var nextState = ui(initState, {type:'TOGGLE_ADD_CATEGORY_MODE'})
    expect(nextState.get('categoryAddMode')).toEqual(true)
    nextState = ui(nextState, {type:'TOGGLE_ADD_CATEGORY_MODE'})
    expect(nextState.get('categoryAddMode')).toEqual(false)
  })

  it('should handle TOGGLE_ADD_PRODUCT_MODE', () => {
    const initState = ui(undefined, {})
    expect(initState.get('productAddMode')).toEqual(false)
    var nextState = ui(initState, {type:'TOGGLE_ADD_PRODUCT_MODE'})
    expect(nextState.get('productAddMode')).toEqual(true)
    nextState = ui(nextState, {type:'TOGGLE_ADD_PRODUCT_MODE'})
    expect(nextState.get('productAddMode')).toEqual(false)
  })

  it('should handle SEARCH_LOCAL', () => {
    const initState = ui(undefined, {})
    var nextState = ui(initState, {type:'SEARCH_LOCAL', value: 'searchToken'})
    expect(nextState.get('search')).toEqual('searchToken')
    nextState = ui(initState, {type:'SEARCH_LOCAL', value: ''})
    expect(nextState.get('search')).toEqual('')
  })

  it('should handle RECEIVE_SEARCH_PRODUCTS', () => {
    const initState = ui(undefined, {})
    const action = {
      type:'RECEIVE_SEARCH_PRODUCTS',
      response: {
        1: {id: 1, name: '2'}
      }
    }
    var nextState = ui(initState, action)
    expect(nextState.get('searchProductsResults')).toEqual(fromJS(action.response))
  })

})
