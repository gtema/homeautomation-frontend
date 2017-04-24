//components/ProductItem.js
import React from 'react'
import PropTypes from 'prop-types'

import ProductItem from './ProductItem'
import { productItemsPropTypes } from '../tools/constants'

// List of Product Items of the given category
class ProductItemList extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(productItemsPropTypes.isRequired),
    // inactiveItems: PropTypes.arrayOf(productItemsPropTypes.isRequired),
    modifyFn: PropTypes.func,
    addFn: PropTypes.func,
    productId: PropTypes.number.isRequired,
    active: PropTypes.bool,
  }

  static defaultProps = {
    editItemId: null,
    active: true,
  }

  render() {

    const {elements, active, modifyFn, addFn, productId} = this.props
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
}
// const ProductItemList = ({ params, elements, active, toggleEditFn, modifyFn, addFn, editItemId, productId }) => {
// }

export default ProductItemList
