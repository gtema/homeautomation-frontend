import React, { PropTypes } from 'react'
import ProductItem from './ProductItem'
// import { ListGroup, ListGroupItem } from 'react-bootstrap'

import { productItemsPropTypes } from '../tools/constants'



// List of Product Items of the given category
const ProductItemList = ({ params, elements, active, toggleEditFn, modifyFn, addFn, editItemId, productId }) => {

  return (
    <ul className="list-group productitems-list">
      { addFn &&
        <ProductItem
          key={-1}
          modifyFn={modifyFn}
          addFn={addFn}
          id={-1}
          productId={productId}
          />
      }
      { addFn &&
        <li />
      }
      {
        elements
          .map(item =>
            <ProductItem
              key={item.id}
              {...item}
              modifyFn={modifyFn}
              inactive={!active}
              productId={item.product_id}
              />
          )
      }

    </ul>
  )

}

ProductItemList.propTypes = {
  items: PropTypes.arrayOf(productItemsPropTypes.isRequired),
  // inactiveItems: PropTypes.arrayOf(productItemsPropTypes.isRequired),
  toggleEditFn: PropTypes.func,
  modifyFn: PropTypes.func,
  addFn: PropTypes.func,
  editItemId: PropTypes.number,
  productId: PropTypes.number.isRequired,
  active: PropTypes.bool,
}

ProductItemList.defaultProps = {
  editItemId: null,
  active: true,
}

export default ProductItemList
