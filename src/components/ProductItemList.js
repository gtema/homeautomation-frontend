import React, { PropTypes } from 'react'
import ProductItem from './ProductItem'
import { ListGroup } from 'react-bootstrap'

import { productItemsPropTypes } from '../tools/constants'

// List of Product Items of the given category
const ProductItemList = ({ params, elements, toggleEditFn, modifyFn, editItemId }) => {

  return (
    <ListGroup bsClass="list-group productitems-list" componentClass="ul">
    {
      elements.map(item =>
        <ProductItem
        key={item.id}
        {...item}
        toggleEditFn={toggleEditFn}
        modifyFn={modifyFn}
        enableEdit={ (item.id === editItemId )? true:false}
        />
      )
    }

    </ListGroup>
  )

}

ProductItemList.propTypes = {
  elements: PropTypes.arrayOf(productItemsPropTypes.isRequired),
  toggleEditFn: PropTypes.func.isRequired,
  modifyFn: PropTypes.func.isRequired,
  editItemId: PropTypes.number
}

ProductItemList.defaultProps = {
  editItemId: null,
}

export default ProductItemList
