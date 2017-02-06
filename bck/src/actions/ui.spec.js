import	configureMockStore	from	'redux-mock-store'
import	thunk	from	'redux-thunk'
import	*	as	uiActions	from	'./ui'
import	nock	from	'nock'
// import jest from 'jest'

const	middlewares	=	[	thunk	]
const	mockStore	=	configureMockStore(middlewares)

describe('ui actions', () => {

  afterEach(()	=>	{
    nock.cleanAll()
  });

  it('handles TOGGLE_PRODUCT_EDIT_MODE', () => {
    const store = mockStore({})

    expect(uiActions.toggleProductEditMode(3)).toEqual({
        type: 'TOGGLE_PRODUCT_EDIT_MODE',
        id: 3
      })

    expect(uiActions.toggleProductEditMode(null)).toEqual({
        type: 'TOGGLE_PRODUCT_EDIT_MODE',
        id: null
      })
  });
  it('handles TOGGLE_CATEGORY_EDIT_MODE', () => {
    const store = mockStore({})

    expect(uiActions.toggleCategoryEditMode(3)).toEqual({
        type: 'TOGGLE_CATEGORY_EDIT_MODE',
        id: 3
      })

    expect(uiActions.toggleCategoryEditMode(null)).toEqual({
        type: 'TOGGLE_CATEGORY_EDIT_MODE',
        id: null
      })
  });

//   it('creates	FETCH_TODOS_SUCCESS	when	fetching	todos	has	been	done',	()	=>	{
//     nock('http://example.com/')
//         .get('/todos')
//         .reply(200,	{	body:	{	todos:	['do	something']	}})
//     const	expectedActions	=	[
//         {	type:	types.FETCH_TODOS_REQUEST	},
//         {	type:	types.FETCH_TODOS_SUCCESS,	body:	{	todos:	['do	something']		}	}
//     ]
//     const	store	=	mockStore({	todos:	[]	})
//     return	store.dispatch(actions.fetchTodos())
//         .then(()	=>	{	//	return	of	async	actions
//             expect(store.getActions()).toEqual(expectedActions)
//         })
// })


});
