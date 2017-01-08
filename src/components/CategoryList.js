import React, { PropTypes } from 'react'
import Category from './Category'
import { ListGroup } from 'react-bootstrap'

import { categoryPropTypes } from '../tools/constants'

// List of subCategories of the given category
const CategoryList = ({ params, elements, toggleEditFn, modifyFn, editItemId }) => {

  return (
    <ListGroup bsClass="list-group subcategories-list" >
    {
      elements
        .map(category =>
          <Category
          key={category.id}
          {...category}
          toggleEditFn={toggleEditFn}
          modifyFn={modifyFn}
          enableEdit={ (category.id === editItemId )? true:false}
          />
        )
    }

    </ListGroup>
  )

}

// <Category
//   key={-1}
//   id={-1}
//   parent_id={categoryEditId}
//   name={'none'}
//   toggleCategoryEditMode={toggleCategoryEditMode}
//   modifyCategory={modifyCategory}
//   enableEdit={true}
// />

CategoryList.propTypes = {
  elements: PropTypes.arrayOf(categoryPropTypes.isRequired),
  toggleEditFn: PropTypes.func.isRequired,
  modifyFn: PropTypes.func.isRequired,
  editItemId: PropTypes.number
}

CategoryList.defaultProps = {
  editItemId: null,
}

export default CategoryList
