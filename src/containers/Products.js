import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'

import classnames from 'classnames';


import 'purecss/build/grids-responsive-min.css'
import './Products.css'

import Icon from '../basecomponents/Icon'
import Button from '../basecomponents/Button'
import Spinner from '../basecomponents/Spinner'

import * as UIActionCreators from '../actions/ui'
import * as ProductActionCreators from '../actions/products'
import { productPropTypes, cataloguePath } from '../tools/constants'
import { getDatesDiffInDays } from '../tools/common'

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

  constructor(props) {
    super(props)
    this.state={
      'today': new Date(),
    }
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

    const itemClassNames = "pure-u-sm-1-1 pure-u-md-1-2 pure-u-lg-1-3 pure-u-xl-1-5"

    const productItem = (product) => {
      const productExpiresInDays = getDatesDiffInDays(product.first_started_ed, this.state.today);
      const link = cataloguePath + '/' + product.category_id + '/item/' + product.id;
      return (
        <div className={itemClassNames} key={product.id}>
          <section className={classnames("panel", {
                              "panel-warning":
                                (productExpiresInDays !== null && productExpiresInDays  <= 3 )
                            })}>
            <div className="panel-body">
              <Link to={link}>
                <div className="media">
                  <div className="media-body">
                    <h4 className="media-heading">
                        {product.name}
                    </h4>
                    <div>
                      <span className="item-attribute-name">Amount</span>
                      <span className="item-attribute-value">{product.amount}</span>
                    </div>
                    {product.volume &&
                      <div>
                        <span className="item-attribute-name">Volume</span>
                        <span className="item-attribute-value">{product.volume}</span>
                      </div>
                    }
                    {product.first_started_ed &&
                      <div>
                        <span className="item-attribute-name">Open expiry</span>
                        <span className="item-attribute-value">{new Date(product.first_started_ed).toLocaleDateString()} (in {getDatesDiffInDays(product.first_started_ed, this.state.today)} days)</span>
                      </div>
                    }
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      )
    }

    return (
        <div className="ProductsApp">
        { ui.productsLastUpdatedAt &&
          <span>Last Updated at {new Date(ui.productsLastUpdatedAt).toLocaleTimeString()}.{' '}</span>
        }
        { (fetchingProductsByCategoryId === categoryId) ?
          (<Spinner />)
          :
          (
              <div className="pure-g">
                {products.map(productItem)}

                <div className={itemClassNames}>
                  <section className="panel">
                    <Button className="button-small" onClick={this.props.toggleAddProductMode }><Icon icon="fa-plus" /></Button>
                  </section>
                </div>
              </div>
          )
        }

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
      products: getVisibleProductsByCategoryId(state, ownProps),
      categoryId: groupId,
      ui: state.ui.toObject(),
      fetchingProductsByCategoryId: state.ui.get('fetchingProductsByCategoryId')
    }
  }

  return mapStateToProps
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(Object.assign({}, UIActionCreators, ProductActionCreators), dispatch)
}

const ProductsApp = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ProductsAppImpl)

export default ProductsApp
