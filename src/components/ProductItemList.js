import React, { PropTypes } from 'react'
import ProductItem from './ProductItem'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

import { productItemsPropTypes } from '../tools/constants'



// List of Product Items of the given category
const ProductItemList = ({ params, activeItems, inactiveItems, toggleEditFn, modifyFn, addFn, editItemId, productId }) => {

  return (
    <ListGroup bsClass="list-group productitems-list" componentClass="ul">
      <ProductItem
        key={-1}
        toggleEditFn={toggleEditFn}
        modifyFn={modifyFn}
        addFn={addFn}
        enableEdit={true}
        id={-1}
        productId={productId}
        />
      <ListGroupItem />
      {
        activeItems
          .map(item =>
            <ProductItem
              key={item.id}
              {...item}
              toggleEditFn={toggleEditFn}
              modifyFn={modifyFn}
              enableEdit={ (item.id === editItemId )? true:false}
              productId={item.product_id}
              />
          )
      }
      <ListGroupItem />
      {
        inactiveItems
          .map(item =>
            <ProductItem
              key={item.id}
              {...item}
              enableEdit={false}
              inactive={true}
              productId={item.product_id}
              />
          )
      }
    </ListGroup>
  )

}

ProductItemList.propTypes = {
  activeItems: PropTypes.arrayOf(productItemsPropTypes.isRequired),
  inactiveItems: PropTypes.arrayOf(productItemsPropTypes.isRequired),
  toggleEditFn: PropTypes.func.isRequired,
  modifyFn: PropTypes.func.isRequired,
  addFn: PropTypes.func.isRequired,
  editItemId: PropTypes.number,
  productId: PropTypes.number.isRequired,
}

ProductItemList.defaultProps = {
  editItemId: null,
}

export default ProductItemList
