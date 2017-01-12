import React, { PropTypes, Component }  from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Panel, Col, Image } from 'react-bootstrap'
import { Button, Glyphicon } from 'react-bootstrap'
// import { LinkContainer } from 'react-router-bootstrap'
// import { Link } from 'react-router'

import * as UIActionCreators from '../actions/ui'
import * as ProductActionCreators from '../actions/products'
import { productPropTypes, cataloguePath } from '../tools/constants'
import Spinner from '../components/Spinner'

import { makeGetVisibleProductsByCategoryId } from '../selectors/Catalogue'

// Component for presenting list of products in the given productCategory
class ProductsAppImpl extends Component {

  static propTypes = {
    categoryId: PropTypes.number.isRequired,
    products: PropTypes.arrayOf(productPropTypes),
    ui: PropTypes.object,
    error: PropTypes.string
  }

  static defaultProps = {
    products: [{id:0, name:'', category_id:0}]
  }

  componentDidMount() {
    this.props.loadProductsByCategoryIdIfNeeded(this.props.categoryId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categoryId !== this.props.categoryId) {
      this.props.loadProductsByCategoryIdIfNeeded(nextProps.categoryId);;
    }
  }

  componentWillUnmount() {
    this.props.selectProductId(null);
  }

  render() {
    const { products, children, ui, categoryId, fetchingProductsByCategoryId } = this.props;

    const productItem = (product) => (
      <Col lg={3} md={4} sm={6} xs={12} key={product.id}
      >
        <Panel>
        <Link to={{
          pathname: cataloguePath + '/' + product.category_id + '/item/' + product.id
        }}>
          <div className="media">
            <div className="media-left">
              <Image className="media-object" src=".." alt=".."/>
            </div>
            <div className="media-body">
              <h4 className="media-heading">
                  {product.name}
              </h4>
              {product.amount &&
                <div>
                  <span className="item-attribute-name">Amount</span>
                  <span className="item-attribute-value">{product.amount}</span>
                </div>
              }
              {product.volume &&
                <div>
                  <span className="item-attribute-name">Volume</span>
                  <span className="item-attribute-value">{product.volume}</span>
                </div>
              }
              {product.first_started_ed &&
                <div>
                  <span className="item-attribute-name">Open expiry</span>
                  <span className="item-attribute-value">{new Date(product.first_started_ed).toLocaleDateString()}</span>
                </div>
              }
            </div>
          </div>
        </Link>
        </Panel>
      </Col>
    )

    const spin = null

    return (
        <div className="ProductsApp">
        { ui.productsLastUpdatedAt &&
          <span>Last Updated at {new Date(ui.productsLastUpdatedAt).toLocaleTimeString()}.{' '}</span>
        }
        { (fetchingProductsByCategoryId === categoryId) ?
          (<Spinner />)
          :
          (
            products.map(productItem)
          )
        }
        <Col lg={3} md={4} sm={6} xs={12}>
          <Button componentClass="btn-sm" onClick={() => { this.props.toggleAddProductMode() } }><Glyphicon glyph="plus-sign" /></Button>
        </Col>
        {children}
        </div>
    )
  }
}

// Use mapStateToProps maker in order to use caching for different categoryIds
const makeMapStateToProps = () => {
  const getVisibleProductsByCategoryId = makeGetVisibleProductsByCategoryId()
  const mapStateToProps = (state, ownProps) => {
    let groupId = parseInt(ownProps.params.groupId, 10) || 0;
    return {
      products: getVisibleProductsByCategoryId(state, ownProps),//state.products.getIn(['selectedProductsByCategory', 'products']),
      categoryId: groupId,
      ui: state.ui.toObject(),
      fetchingProductsByCategoryId: state.ui.get('fetchingProductsByCategoryId')
    }
  }

  return mapStateToProps
}

// const mapStateToProps = ( state, ownProps ) => {
//   let groupId = parseInt(ownProps.params.groupId) || 0;
//   return {
//     products: getVisibleProductsByCategoryId(state, ownProps),//state.products.getIn(['selectedProductsByCategory', 'products']),
//     categoryId: groupId,
//     ui: state.ui.toObject()
//   }
// }

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, UIActionCreators, ProductActionCreators), dispatch)
}

const ProductsApp = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ProductsAppImpl)

export default ProductsApp
