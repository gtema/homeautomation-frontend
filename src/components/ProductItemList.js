import React, { PropTypes } from 'react'
import ProductItem from './ProductItem'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

import { productItemsPropTypes } from '../tools/constants'



// List of Product Items of the given category
const ProductItemList = ({ params, elements, active, toggleEditFn, modifyFn, addFn, editItemId, productId }) => {

  return (
    <ListGroup bsClass="list-group productitems-list" componentClass="ul">
      { addFn &&
        <ProductItem
          key={-1}
          toggleEditFn={toggleEditFn}
          modifyFn={modifyFn}
          addFn={addFn}
          enableEdit={true}
          id={-1}
          productId={productId}
          />
      }
      <ListGroupItem />
      {
        elements
          .map(item =>
            <ProductItem
              key={item.id}
              {...item}
              toggleEditFn={toggleEditFn}
              modifyFn={modifyFn}
              enableEdit={ (item.id === editItemId && active)? true:false}
              inactive={!active}
              productId={item.product_id}
              />
          )
      }

    </ListGroup>
  )

}

ProductItemList.propTypes = {
  items: PropTypes.arrayOf(productItemsPropTypes.isRequired),
  // inactiveItems: PropTypes.arrayOf(productItemsPropTypes.isRequired),
  toggleEditFn: PropTypes.func.isRequired,
  modifyFn: PropTypes.func.isRequired,
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
