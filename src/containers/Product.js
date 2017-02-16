import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import browserHistory from 'react-router/lib/browserHistory'

import 'purecss/build/forms-nr-min.css'

import ButtonGroup from '../basecomponents/ButtonGroup'
import Button from '../basecomponents/Button'
import Icon from '../basecomponents/Icon'

import ProductItemList from '../components/ProductItemList'

import * as UIActionCreators from '../actions/ui'
import * as CategoriesActionCreators from '../actions/categories'
import * as ProductActionCreators from '../actions/products'
import * as ProductItemsActionCreators from '../actions/productItems'
import { productPropTypes, productItemsPropTypes, cataloguePath } from '../tools/constants'
// import Spinner from '../components/Spinner'

import { makeGetCurrentProduct, makeGetActiveProductItemsByProductId, makeGetInactiveProductItemsByProductId } from '../selectors/Catalogue'
import {getISODate} from '../tools/common'


// Single Product presentation
class ProductImpl extends Component {

  static propTypes = {
    product: productPropTypes.isRequired,
    productId: PropTypes.number.isRequired,
    activeProductItems: PropTypes.arrayOf(productItemsPropTypes),
    inActiveProductItems: PropTypes.arrayOf(productItemsPropTypes),
    editMode: PropTypes.bool
  }

  static defaultProps = {
      product: {name:'', id: 0, category_id: 0},
      editMode: false
  }

  constructor(props) {
    super(props)
    this.state={
      'name': (props.product && props.product.name)? props.product.name : '',
      'volume': (props.product && props.product.volume)? props.product.volume : '',
      'first_started_ed': (props.product )? props.product.first_started_ed : undefined,
      'first_started_ed_fmt': (props.product && props.product.first_started_ed)? getISODate(new Date(props.product.first_started_ed)) : '',
      'sum_amounts': (props.product && props.product.sum_amounts)? props.product.sum_amounts : false,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
  }

  componentDidMount() {
    this.props.loadProductByProductIdIfNeeded(this.props.productId);
    this.props.loadProductItemsByProductIdIfNeeded(this.props.productId);
  }

  componentWillUnmount() {
    this.props.selectProductId(null);
  }

  componentWillUpdate(nextProps, nextState) {
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* trigger change only if something except product has changed*/
    if (nextState !== this.state ||
      nextProps.editMode !== this.props.editMode ||
      nextProps.productId !== this.props.productId ||
      nextProps.activeProductItems !== this.props.activeProductItems ||
      nextProps.inActiveProductItems !== this.props.inActiveProductItems) {
      return true
    } else {
      return false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.productId !== this.props.productId) {
      // this.props.requestProductIfNeeded(nextProps.productId);
      this.props.loadProductByProductIdIfNeeded(nextProps.productId)
      this.props.loadProductItemsByProductIdIfNeeded(nextProps.productId);
    }
    if (nextProps.product.name !== this.state.name ||
        nextProps.product.volume !== this.state.volume ||
        (typeof(nextProps.product.first_started_ed) !== undefined && nextProps.product.first_started_ed !== this.state.first_started_ed) ||
        nextProps.product.sum_amounts !== this.state.sum_amounts) {
      this.setState({
        'name': nextProps.product.name || '',
        'volume': nextProps.product.volume || '',
        'first_started_ed': nextProps.product.first_started_ed ,
        'first_started_ed_fmt': (nextProps.product.first_started_ed) ? getISODate(new Date(nextProps.product.first_started_ed)): '',
        'sum_amounts': nextProps.product.sum_amounts || false,
      })
    }
  }

  handleInputChange(event) {
    const target = event.target
    const value = (target.type === 'checkbox') ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]:value
    })
  }

  cancelEdit(e) {
    e.preventDefault()
    this.props.toggleProductEditMode(null)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.modifyProduct({
      id : this.props.product.id,
      category_id : this.props.product.category_id,
      name : this.state.name,
      volume : this.state.volume,
      sum_amounts : this.state.sum_amounts,
    });
    this.props.toggleProductEditMode(null);
  }

  render() {
    const { editMode, product, toggleProductEditMode, removeProductByProductId, productItemEditId} = this.props

    // Panel header (name, edit&delete buttons)
    const header = (
      <div className="panel-header">
        <div className="header-name">
          <span>{this.state.name}</span>
        </div>
        <div className="pull-right">
          {editMode ?
            (
              <ButtonGroup>
                <Button className="button-small bg-warning" type="reset" onClick={ this.cancelEdit }>
                  <Icon icon="fa-undo" />
                </Button>
                <Button className="button-small bg-success" type="submit" onClick={ this.handleSubmit }>
                  <Icon icon="fa-check" />
                </Button>
              </ButtonGroup>
            ) : (
              <ButtonGroup>
                <Button className="button-small bg-secondary" onClick={() => {
                  toggleProductEditMode(product.id)
                }}>
                  <Icon icon="fa-pencil" />
                </Button>
                <Button className="button-small bg-warning" onClick={() => {
                  browserHistory.push(cataloguePath + '/' + product.category_id);
                  removeProductByProductId(product.id);
                }}>
                  <Icon icon="fa-trash" />
                </Button>
              </ButtonGroup>
            )
          }
        </div>
      </div>
    )

    let opts = {};
    if (!editMode) {
      opts['readOnly'] = 'readOnly'
    }

    const form = (
      <form onSubmit={this.handleSubmit} onReset={this.cancelEdit} className="pure-form pure-form-aligned">
        <fieldset>
          <div className="pure-control-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" required
              value={ this.state.name }
              onChange={ this.handleInputChange }
              placeholder="Product Name"
              {...opts}
            />
          </div>

          <div className="pure-control-group">
            <label htmlFor="volume">Volume</label>
            <input type="text" name="volume" required
              value={ this.state.volume }
              onChange={ this.handleInputChange }
              placeholder="Volume entity (Liter, Pack, etc.)"
              {...opts}
            />
          </div>

          <div className="pure-control-group">
            <label htmlFor="sum_amounts">Sum amounts</label>
            <input type="checkbox" name='sum_amounts'
              checked={this.state.sum_amounts}
              onChange={ this.handleInputChange }
              title="If checked sum amounts of individual entities, otherwise return count of items as product amount"
              disabled={!editMode}
            />
          </div>

          <div className="pure-control-group">
            <label htmlFor="amount">Amount</label>
            <span>{this.props.product.amount}</span>
          </div>

          <div className="pure-control-group">
            <label htmlFor="amount">Open expires</label>
            <span>{this.props.product.first_started_ed_fmt}</span>
          </div>

        </fieldset>
      </form>
    )

    return (
      <section className="panel">
        <header className="panel-header bg-primary">{header}</header>
        <div className="panel-description">
          {form}

          {(this.props.productId!== -1) &&
              <ProductItemList
                elements={this.props.activeProductItems}
                toggleEditFn={this.props.toggleProductItemEditMode}
                modifyFn={this.props.modifyProductItem}
                addFn={this.props.addNewProductItem}
                editItemId={productItemEditId}
                productId={this.props.productId}
                active={true}
              />
          }

          {(this.props.productId!== -1) &&
              <ProductItemList
                elements={this.props.inActiveProductItems}
                productId={this.props.productId}
                active={false}
              />
          }
        </div>
      </section>
    )

  }
}

// Use mapStateToProps maker in order to use caching for different categoryIds
const makeMapStateToProps = () => {

  const product = makeGetCurrentProduct();
  const activeItems = makeGetActiveProductItemsByProductId();
  const inActiveItems = makeGetInactiveProductItemsByProductId();

  const mapStateToProps = (state, ownProps) => {
    const id = parseInt(ownProps.params.itemId, 10);
    return {
      productId: id,
      product: product(state, ownProps),
      activeProductItems: activeItems(state, ownProps),
      inActiveProductItems: inActiveItems(state, ownProps),
      editMode: (state.ui.get('productEditId') === id || id === -1)? true:false,
      productItemEditId: state.ui.get('productItemEditId')
    }
  }

  return mapStateToProps
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
      Object.assign({},
        UIActionCreators, CategoriesActionCreators, ProductActionCreators, ProductItemsActionCreators),
      dispatch)
}

const Product = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ProductImpl)

export default Product
