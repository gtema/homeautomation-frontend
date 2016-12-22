import { createSelector } from 'reselect'

// Remember: keys in Immutable.js are strings in our case

// const getSelectedCategory = (state) => state.ui.get('selectedCategoryId')
const getCategoriesById = (state) => state.categories.get('categoriesById')
// const getCategoriesByGroupId = (state) => state.categories.get('categoriesByGroupId')
const getCategoryIdsByCategoryId = (state, props) => state.categories.getIn(['categoriesByGroupId', props.params.groupId || "0"])
const getPropCurrentCategoryId = (state, props) => parseInt(props.params.groupId, 10) || 0
const getStateCurrentCategory = (state, props) => state.categories.getIn(['categoriesById', props.params.groupId || "0"])

// Products
const getProductsById = (state) => state.products.get('productsById')
const getProductById = (state, props) => state.products.getIn(['productsById', props.params.itemId])
const getProductIdsByCategoryId = (state, props) => state.products.getIn(['productsByCategoryId', props.params.groupId || "0"])

// Product Items
const getProductItemsById = (state) => state.productItems.get('productItemsById')
const getProductItemById = (state, props) => state.productItems.getIn(['productItemsById', props.params.itemId])
const getProductItemIdsByProductId = (state, props) => state.productItems.getIn(['productItemsByProductId', props.params.itemId || "0"])

export const getVisibleSubcategories = createSelector(
  [getCategoriesById, getCategoryIdsByCategoryId],
  (categoriesById, categoryIdsByCategoryId) => {
    if (typeof(categoryIdsByCategoryId) !== 'undefined' ) {
      // Get the categories by the groupId
      const categories = categoriesById
        .filter(cat => categoryIdsByCategoryId.has(cat.get('id').toString()))
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

export const getProductItemsByProductId = createSelector(
  [getProductItemsById, getProductItemIdsByProductId],
  (objById, idsByParent) => {
    if (typeof(idsByParent) !== 'undefined' ) {
      // Get the categories by the groupId
      const items = objById
        .filter(item => idsByParent.has(item.get('id').toString()))
        .map(item => item.toObject()).toArray()
        || []
      console.log("result of select for product items", items)

      return items
    } else {
      return []
    }
  }
)

export const makeGetProductItemsByProductId = () => {
  return getProductItemsByProductId
}
