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

// Calculate difference in days between two dates
export const getDatesDiffInDays = (date1, date2) => {

	if (typeof(date1) === 'string') {
		date1 = new Date(date1)
	} else if (typeof(date1) === 'undefined') {
		return null;
	}
	if (typeof(date2) === 'string') {
		date2 = new Date(date2)
	} else if (typeof(date2) === 'undefined') {
		return null;
	}

	var timeDiff = new Date(date1).getTime() - date2.getTime();
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	return diffDays;

}

export function PureDropdown(dropdownParent) {

		var PREFIX = 'pure-',
				ACTIVE_CLASS_NAME = PREFIX + 'menu-active',
				ARIA_ROLE = 'role',
				ARIA_HIDDEN = 'aria-hidden',
				MENU_OPEN = 0,
				MENU_CLOSED = 1,
				MENU_PARENT_CLASS_NAME = 'pure-menu-has-children',
				MENU_ACTIVE_SELECTOR = '.pure-menu-active',
				MENU_LINK_SELECTOR = '.pure-menu-link',
				MENU_SELECTOR = '.pure-menu-children',
				DISMISS_EVENT = (window.hasOwnProperty &&
						window.hasOwnProperty('ontouchstart')) ?
								'touchstart' : 'mousedown',

				ARROW_KEYS_ENABLED = true,

				ddm = this; // drop down menu

				this._state = MENU_CLOSED;

				this.show = function () {
						if (this._state !== MENU_OPEN) {
								this._dropdownParent.classList.add(ACTIVE_CLASS_NAME);
								this._menu.setAttribute(ARIA_HIDDEN, false);
								this._state = MENU_OPEN;
						}
				};

				this.hide = function () {
						if (this._state !== MENU_CLOSED) {
								this._dropdownParent.classList.remove(ACTIVE_CLASS_NAME);
								this._menu.setAttribute(ARIA_HIDDEN, true);
								this._link.focus();
								this._state = MENU_CLOSED;
						}
				};

				this.toggle = function () {
						this[this._state === MENU_CLOSED ? 'show' : 'hide']();
				};

				this.halt = function (e) {
						e.stopPropagation();
						e.preventDefault();
				};

				this._dropdownParent = dropdownParent;
				this._link = this._dropdownParent.querySelector(MENU_LINK_SELECTOR);
				this._menu = this._dropdownParent.querySelector(MENU_SELECTOR);
				this._firstMenuLink = this._menu.querySelector(MENU_LINK_SELECTOR);

				// Set ARIA attributes
				this._link.setAttribute('aria-haspopup', 'true');
				this._menu.setAttribute(ARIA_ROLE, 'menu');
				this._menu.setAttribute('aria-labelledby', this._link.getAttribute('id'));
				this._menu.setAttribute('aria-hidden', 'true');
				[].forEach.call(
						this._menu.querySelectorAll('li'),
						function(el){
								el.setAttribute(ARIA_ROLE, 'presentation');
						}
				);
				[].forEach.call(
						this._menu.querySelectorAll('a'),
						function(el){
								el.setAttribute(ARIA_ROLE, 'menuitem');
						}
				);

				// Toggle on click
				this._link.addEventListener('click', function (e) {
						e.stopPropagation();
						e.preventDefault();
						ddm.toggle();
				});

				// Keyboard navigation
				document.addEventListener('keydown', function (e) {
						var currentLink,
								previousSibling,
								nextSibling,
								previousLink,
								nextLink;

						// if the menu isn't active, ignore
						if (ddm._state !== MENU_OPEN) {
								return;
						}

						// if the menu is the parent of an open, active submenu, ignore
						if (ddm._menu.querySelector(MENU_ACTIVE_SELECTOR)) {
								return;
						}

						currentLink = ddm._menu.querySelector(':focus');

						// Dismiss an open menu on ESC
						if (e.keyCode === 27) {
								/* Esc */
								ddm.halt(e);
								ddm.hide();
						}
						// Go to the next link on down arrow
						else if (ARROW_KEYS_ENABLED && e.keyCode === 40) {
								/* Down arrow */
								ddm.halt(e);
								// get the nextSibling (an LI) of the current link's LI
								nextSibling = (currentLink) ? currentLink.parentNode.nextSibling : null;
								// if the nextSibling is a text node (not an element), go to the next one
								while (nextSibling && nextSibling.nodeType !== 1) {
										nextSibling = nextSibling.nextSibling;
								}
								nextLink = (nextSibling) ? nextSibling.querySelector(MENU_LINK_SELECTOR) : null;
								// if there is no currently focused link, focus the first one
								if (!currentLink) {
										ddm._menu.querySelector(MENU_LINK_SELECTOR).focus();
								}
								else if (nextLink) {
										nextLink.focus();
								}
						}
						// Go to the previous link on up arrow
						else if (ARROW_KEYS_ENABLED && e.keyCode === 38) {
								/* Up arrow */
								ddm.halt(e);
								// get the currently focused link
								previousSibling = (currentLink) ? currentLink.parentNode.previousSibling : null;
								while (previousSibling && previousSibling.nodeType !== 1) {
										previousSibling = previousSibling.previousSibling;
								}
								previousLink = (previousSibling) ? previousSibling.querySelector(MENU_LINK_SELECTOR) : null;
								// if there is no currently focused link, focus the last link
								if (!currentLink) {
										ddm._menu.querySelector('.pure-menu-item:last-child ' + MENU_LINK_SELECTOR).focus();
								}
								// else if there is a previous item, go to the previous item
								else if (previousLink) {
										previousLink.focus();
								}
						}
				});

				// Dismiss an open menu on outside event
				document.addEventListener(DISMISS_EVENT, function (e) {
						var target = e.target;
						if (target !== ddm._link && !ddm._menu.contains(target)) {
								ddm.hide();
								ddm._link.blur();
						}
				});
}

export function initDropdowns() {
	console.log("init dropdowns")
		var dropdownParents = document.querySelectorAll('.pure-menu-has-children');
		for (var i = 0; i < dropdownParents.length; i++) {
			console.log("init dropdown ",dropdownParents[i] )
				var ddm = new PureDropdown(dropdownParents[i]);
		}
}
