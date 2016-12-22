import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { Panel, Col, Image } from 'react-bootstrap'

// import Product from './Product'
import { productPropTypes } from '../tools/constants'

const productItemUi = (product) => {

  const { category_id, id, name } = product;

  return (
    <Col lg={3} md={4} sm={6} xs={12} key={id}
    >
      <Panel>
      <Link to={{
        pathname: '/cat/' + category_id + '/item/' + id
      }}>
        <div className="media">
          <div className="media-left">
            <Image className="media-object" src=".." alt=".."/>
          </div>
          <div className="media-body">
            <h4 className="media-heading">
                {name}
            </h4>
          </div>
        </div>
      </Link>
      </Panel>
    </Col>
  )
}

const ProductList = ({ params, products, toggleProductEditMode, modifyProduct, ui }) => {
    console.log("ProductList ",products)

    return (
      <div>
        {products.map(productItemUi)}
      </div>
    )
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(productPropTypes.isRequired),
  toggleProductEditMode: PropTypes.func.isRequired,
  modifyProduct: PropTypes.func.isRequired,
  ui: PropTypes.shape({
    productEdit: PropTypes.string
  })
}

export default ProductList
