import { createSelector } from 'reselect'
import { Map, Set } from 'immutable'

// Remember: keys in Immutable.js are strings in our case

// const getSelectedCategory = (state) => state.ui.get('selectedCategoryId')
const getCategoriesById = (state) => state.categories.get('categoriesById')
const getCategoryIdsByCategoryIdAll = (state) => state.categories.get('categoriesByGroupId')
// const getCategoriesByGroupId = (state) => state.categories.get('categoriesByGroupId')
const getCategoryIdsByCategoryId = (state, props) => state.categories.getIn(['categoriesByGroupId', props.params.groupId || "0", 'items'])
const getPropCurrentCategoryId = (state, props) => parseInt(props.params.groupId, 10) || 0
const getStateCurrentCategory = (state, props) => state.categories.getIn(['categoriesById', props.params.groupId || "0"])

// const getCategoriesSearch = (state) => state.categories.get('categoriesById').filter(item => item.name)

// Products
const getProductsById = (state) => state.products.get('productsById')
const getProductById = (state, props) => state.products.getIn(['productsById', props.params.itemId])
const getProductIdsByCategoryId = (state, props) => state.products.getIn(['productsByCategoryId', props.params.groupId || "0", 'items'])

// Product Items
const getProductItemsById = (state) => state.productItems.get('productItemsById')
// const getProductItemById = (state, props) => state.productItems.getIn(['productItemsById', props.params.itemId])
const getProductItemIdsByProductId = (state, props) => state.productItems.getIn(['productItemsByProductId', props.params.itemId || "0", 'items'])

const getSearchName = (state) => state.ui.get('search')

const denormalizeCategories = (objById, idsByParent, categoryId) => {
  // console.debug("denormalize for category=" + categoryId, idsByParent.get('0'))

  const childrenIds = Map(idsByParent.getIn([categoryId.toString(), 'items'])).keySeq()

  const tree = childrenIds
    .map(cat => objById.get(cat.toString()))
    .sortBy((item) => { return item.get('prio').toString().padStart(3, "0") + item.get('name') })
    .map(cat => {
        const children = denormalizeCategories(objById, idsByParent, cat.get('id'));
        if (children.length > 0) {
          return cat.set('children', children)
        } else {
          return cat
        }
      } )
    .filter(cat => typeof cat !== 'undefined')
    .map(cat => cat.toObject())
    .toArray()

    //.map(cat => cat.set('children', denormalizeCategories(objById, idsByParent, cat.get('id'))))
  // console.debug("denormalize results=" + tree, tree)
  return tree
}

export const getCategoriesTree = createSelector(
  [getCategoriesById, getCategoryIdsByCategoryIdAll],
  (objById, idsByParent) => {
    // console.log(idsByParent.constructor.name)
    const tree = denormalizeCategories(objById, idsByParent, 0)
    // console.debug("denormalize final result=" + JSON.stringify(tree), tree)
    return tree
  }
)

export const makeGetCategoriesTree = () => {
  return getCategoriesTree
}

export const getVisibleSubcategories = createSelector(
  [getCategoriesById, getCategoryIdsByCategoryId],
  (categoriesById, categoryIdsByCategoryId) => {
    if (typeof(categoryIdsByCategoryId) !== 'undefined' ) {
      // Get the categories by the groupId
      const categories = categoriesById
        .filter(cat => categoryIdsByCategoryId.has(cat.get('id').toString()))
        .sortBy((item) => { return item.get('prio') + item.get('name') })
        .map(cat => cat.toObject()).toArray()
        || []
      console.log("result of select", categories)

      return categories
    } else {
      return []
    }
  }
)

export const makeGetVisibleSubcategoriesByCategoryId = () => {
  return getVisibleSubcategories
}

export const getCurrentCategory = createSelector(
  [getStateCurrentCategory],
  (currentCategory) => {
    if (currentCategory) {
      return currentCategory.toObject()
    } else {
      // return {
      //   id: 0,
      //   parent_id: 0,
      //   name: ''
      // }
    }
  }
)

export const makeGetCurrentCategory = () => {
  return getCurrentCategory
}


// Get "path" to the root category from the given category
// used to build a Breadcrumb navi
export const getPathToRootFromGroupId = createSelector(
  [getPropCurrentCategoryId, getCategoriesById],
  (categoryId, categoriesById) => {
    if (categoriesById) {
      let path = []
      let currentId = categoryId
      let cat = categoriesById.get(currentId.toString())
      // Safety limit
      let deepness = 10
      while (cat && currentId > 0 && 0 < deepness-- ) {
        //console.trace("retrieving parent group " + currentId)
        //if (groupId !== currentId) {
          // Do not put the category itself into the path
          path.push(cat.toObject())
        //}
        currentId = cat.get('parent_id')
        cat = categoriesById.get(currentId.toString())
      }
      if (0 !== categoryId) {
        // Add the root to the path, unless we are on top
        path.push({
          id: 0,
          parent_id: 0,
          name: "Root"
        })
      }

      return path.reverse()
    } else {
      return []
    }
  }
)

export const makeGetPathToRootFromCategoryId = () => {
  return getPathToRootFromGroupId
}

export const getCurrentProduct = createSelector(
  [getProductById],
  (currentProduct) => {
    if (typeof(currentProduct) !== 'undefined' ) {
      return currentProduct.toObject()
    }
  }
)

export const makeGetCurrentProduct = () => {
  return getCurrentProduct
}

const getVisibleProductsByCategoryId = createSelector(
  [getProductsById, getProductIdsByCategoryId],
  (objById, idsByParent) => {
    if (typeof(idsByParent) !== 'undefined' ) {
      // Get the categories by the groupId
      const items = objById
        .filter(item => idsByParent.has(item.get('id').toString()))
        .map(item => item.toObject()).toArray()
        || []
      console.log("result of select for products", items)

      return items
    } else {
      return []
    }
  }
)

export const makeGetVisibleProductsByCategoryId = () => {
  return getVisibleProductsByCategoryId
}

export const getActiveProductItemsByProductId = createSelector(
  [getProductItemsById, getProductItemIdsByProductId],
  (objById, idsByParent) => {
    if (typeof(idsByParent) !== 'undefined' ) {
      // Get the categories by the groupId
      const items = objById
        .filter(item => (idsByParent.has(item.get('id').toString()) && !item.get('is_disposed') && item.get('amount') > 0))
        .sortBy((item) => { return "".concat(!item.get('is_disposed').toString(),(-item.get('amount')).toString()) })
        .map(item => item.toObject()).toArray()
        || []
      console.log("result of reselect for active product items", items)

      return items
    } else {
      return []
    }
  }
)

export const makeGetActiveProductItemsByProductId = () => {
  return getActiveProductItemsByProductId
}

export const getInactiveProductItemsByProductId = createSelector(
  [getProductItemsById, getProductItemIdsByProductId],
  (objById, idsByParent) => {
    if (typeof(idsByParent) !== 'undefined' ) {
      // Get the categories by the groupId
      const items = objById
        .filter(item => idsByParent.has(item.get('id').toString()) && (item.get('is_disposed') || item.get('amount') <= 0))
        .sortBy((item) => { return "".concat(!item.get('is_disposed').toString(),(-item.get('amount')).toString()) })
        .map(item => item.toObject()).toArray()
        || []
      console.log("result of reselect for inactive product items", items)

      return items
    } else {
      return []
    }
  }
)

export const makeGetInactiveProductItemsByProductId = () => {
  return getInactiveProductItemsByProductId
}

export const keyIn = (...keys) => {
  var keySet = Set(keys);
  return function (v, k) {
    return keySet.has(k);
  }
}

export const getCatalogueSearchResults = createSelector(
  [getCategoriesById, getSearchName],
  (catById, searchToken) => {
    if (typeof(searchToken) !== 'undefined' && searchToken !== null && searchToken !== '') {
      const search = searchToken.toLowerCase()
      const items = catById
      .filter(item => item.get('name').toLowerCase().includes(search) )
      .map(item => item.filter(keyIn('id', 'name')).set('type', 'C').toObject() )
      // .map(item => {return {'name': item.get('name')} )
      .toArray()
      return items
    } else {
      return null
    }
  }
)
