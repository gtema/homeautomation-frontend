import { fromJS } from 'immutable'

export const makeActionCreator = (type,	...argNames) => {
	return	function(...args)	{
		let	action	=	{	type	}
		argNames.forEach((arg,	index)	=>	{
			action[argNames[index]]	=	args[index]
		})
		return	action
	}
}

// Common helper function to remove item from the state by ID
export const reducerRemoveItem = ( state, stateIdKey, stateParentKey, itemParentAttribute, id ) => {
  const item = state.getIn([stateIdKey, id.toString()]);

  if (typeof(item) !== 'undefined') {
    return state
        .deleteIn([stateIdKey, id.toString()])
        .deleteIn([stateParentKey, item.get(itemParentAttribute).toString(), 'items', id.toString()])
  } else {
    return state
  }
}

// Common helper function to add items from response into the state
export const reducerReceiveItems = (state, stateIdKey, stateParentKey, itemParentAttribute, normalizeFunction, itemsForSingleParent = false, action) => {
  if (action.status === 'success') {
    // Do the update only if the action is successfull

    let itemsById = {};
    let itemsByParentId = {};
    let deletedIds = [];

    if (typeof action.response === 'object' && !Array.isArray(action.response)) {
      action.response = [action.response]
    }

    // If we receive products by category_id - detect deleted products
    if (itemsForSingleParent) {
      const currentItemsPerParent = state.getIn([stateParentKey, action[itemParentAttribute].toString(), 'items'])
      if (typeof(currentItemsPerParent) !== 'undefined') {
        // gather list of deleted products
        const currentIds = currentItemsPerParent.keySeq()

        const newIds = action.response
          .map(item => item.id)
          .reduce( function(hash, elem){ hash[elem]=true; return hash }, {})

        deletedIds = currentIds.filter(item => !(item in newIds)).toArray()
      }
    }

    // Build JS state parts, not to modify each state element multiple times on an array input
    action.response.forEach(item => {

      const newItem = normalizeFunction(item)

			newItem['_invalidated'] = false

      itemsById[newItem.id] = newItem
      let itemsByParent = itemsByParentId[newItem[itemParentAttribute]]
      // initialize if does not exists
      if (null == itemsByParent) {
        itemsByParent = {
					'invalidated':
						/* If we are note receiving complete bunch per parent OR item.parent != action.parent
							set the group initially to invalid for further refetch*/
						(itemsForSingleParent && newItem[itemParentAttribute] === action[itemParentAttribute]) ? false : true,
					'items': {}
				}
      }
      itemsByParent['items'][item.id] = true
      itemsByParentId[newItem[itemParentAttribute]] = itemsByParent
    })

    // Build incremental State for the further merge
    let incrementState = fromJS({
      [stateIdKey]: itemsById,
      [stateParentKey]: itemsByParentId
    })

    let modState = state.mergeDeep(incrementState)

    if ( typeof(deletedIds) !== 'undefined' ) {
      for (let id in deletedIds) {
        if (deletedIds.hasOwnProperty(id)) {
          modState = reducerRemoveItem(modState, stateIdKey, stateParentKey, itemParentAttribute, deletedIds[id])
        }
      }
    }

    return modState
  } else {
    return state
  }
}

export const reducerInvalidateItemsByParent = (state, stateParentKey, id) => {
	return state.setIn([stateParentKey, id.toString(), 'invalidate'], true)
}

/* Set "invalidate" property of the entity */
export const reducerInvalidateItemById = (state, stateIdKey, id) => {
	const item = state.getIn([stateIdKey, id.toString()]);

  if (typeof(item) !== 'undefined') {
    return state.setIn([stateIdKey, id.toString(), '_invalidated'], true)
  } else {
    return state
  }
}

const pad = (number) => {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

export const getISODate = (date) => {
	return date.getUTCFullYear() +
		'-' + pad(date.getUTCMonth() + 1) +
		'-' + pad(date.getUTCDate());
}

// (function(){
//   if (typeof Object.defineProperty === 'function'){
//     try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
//   }
//   if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;
//
//   function sb(f){
//     for (var i=this.length;i;){
//       var o = this[--i];
//       this[i] = [].concat(f.call(o,o,i),o);
//     }
//     this.sort(function(a,b){
//       for (var i=0,len=a.length;i<len;++i){
//         if (a[i]!=b[i]) return a[i]>b[i]?-1:1;
//       }
//       return 0;
//     });
//     for (var i=this.length;i;){
//       this[--i]=this[i][this[i].length-1];
//     }
//     return this;
//   }
// })();
