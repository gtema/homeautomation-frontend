import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { browserHistory } from 'react-router'
import { Panel, Glyphicon, Button, ButtonGroup, Form, FormGroup, FormControl, Col, ControlLabel, Checkbox } from 'react-bootstrap'

import * as UIActionCreators from '../actions/ui'
import * as CategoriesActionCreators from '../actions/categories'
import * as ProductActionCreators from '../actions/products'
import * as ProductItemsActionCreators from '../actions/productItems'
import { productPropTypes, productItemsPropTypes, cataloguePath } from '../tools/constants'
// import Spinner from '../components/Spinner'
import {getISODate} from '../tools/common'

import { makeGetCurrentProduct, makeGetActiveProductItemsByProductId, makeGetInactiveProductItemsByProductId } from '../selectors/Catalogue'

import ProductItemList from '../components/ProductItemList'

// Single Product presentation
class ProductImpl extends Component {

  static propTypes = {
    product: productPropTypes,
    activeProductItems: PropTypes.arrayOf(productItemsPropTypes),
    inActiveProductItems: PropTypes.arrayOf(productItemsPropTypes),
  }

  static defaultProps = {
      product: {name:'', id: 0, category_id: 0}
  }

  constructor(props) {
    super(props)
    this.state={
      'name': (props.product)? props.product.name : '',
      'volume': (props.product)? props.product.volume : 'x',
      'first_started_ed': (props.product.first_started_ed)? getISODate(new Date(props.product.first_started_ed)) : '',
      'sum_amounts': (props.product)? props.product.sum_amounts: true,
    }
    this.handleChange = this.handleChange.bind(this)
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

  componentWillReceiveProps(nextProps) {
    console.log("nexprops", nextProps)
    if (nextProps.productId !== this.props.productId) {
      // this.props.requestProductIfNeeded(nextProps.productId);
      this.props.loadProductByProductIdIfNeeded(nextProps.productId)
      this.props.loadProductItemsByProductIdIfNeeded(nextProps.productId);
    }
    if (nextProps.product.name !== this.state.name ||
        nextProps.product.volume !== this.state.volume ||
        nextProps.product.first_started_ed !== this.state.first_started_ed ||
        nextProps.product.sum_amounts !== this.state.sum_amounts) {
      this.setState({
        name: nextProps.product.name,
        volume: nextProps.product.volume,
        first_started_ed: getISODate(new Date(nextProps.product.first_started_ed)),
        sum_amounts: nextProps.product.sum_amounts,
      })
    }
  }

  handleChange(event) {
    this.setState({name:event.target.value})
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
    let header = (
      <div className="container-fluid">
        <div className="pull-left">
          <span>{this.state.name}</span>
        </div>
        <div className="pull-right">
          {editMode ?
            (
              <ButtonGroup>
                <Button className="btn-sm btn-warning" type="reset" onClick={ this.cancelEdit }>
                  <Glyphicon glyph="remove" />
                </Button>
                <Button className="btn-sm btn-success" type="submit" onClick={ this.handleSubmit }>
                  <Glyphicon glyph="ok" />
                </Button>
              </ButtonGroup>
            ) : (
              <ButtonGroup>
                <Button className="btn-sm btn-info" onClick={() => {
                  toggleProductEditMode(product.id)
                }}>
                  <Glyphicon glyph="pencil" />
                </Button>
                <Button className="btn-sm btn-danger" onClick={() => {
                  browserHistory.push(cataloguePath + '/' + product.category_id);
                  removeProductByProductId(product.id);
                }}>
                  <Glyphicon glyph="trash" />
                </Button>
              </ButtonGroup>
            )
          }
        </div>
      </div>
    )

    return (
      <Panel header={header} bsStyle="primary">
        <Form horizontal onSubmit={this.handleSubmit} onReset={this.cancelEdit}>
          <FormGroup controlId="productName">
            <Col componentClass={ControlLabel} xs={4} sm={2} md={1} lg={2}>
              Name
            </Col>
            <Col xs={8} sm={10} md={11} lg={10}>
              { (editMode)?
                (
                  <FormControl type='text' name='productName' required
                    value={this.state.name}
                    onChange={(e) => { this.setState({name:e.target.value}) } }
                    placeholder="Product Name"
                  />
                )
                :
                (<FormControl.Static>{this.state.name}</FormControl.Static>)
              }
            </Col>
          </FormGroup>
          <FormGroup controlId="productVolume">
            <Col componentClass={ControlLabel} xs={4} sm={2} md={1} lg={2}>
              Volume
            </Col>
            <Col xs={8} sm={10} md={11} lg={10}>
              { (editMode)?
                (
                  <FormControl type='text' name='productVolume' required
                      value={this.state.volume}
                      onChange={(e) => { this.setState({volume:e.target.value}) } }
                      placeholder="Volume entity (Liter, Pack, etc.)"
                  />
                )
                :
                (<FormControl.Static>{this.state.volume}</FormControl.Static>)
              }
            </Col>
          </FormGroup>
          <FormGroup controlId="productSumAmounts">
            <Col componentClass={ControlLabel} xs={4} sm={2} md={1} lg={2}>
              Sum amounts
            </Col>
            <Col xs={8} sm={10} md={11} lg={10}>
              { (editMode)?
                (
                  <Checkbox name='productSumAmounts' checked={this.state.sum_amounts}
                    onChange={(e) => { this.setState({sum_amounts:e.target.checked}) } }
                    title="If checked sum amounts of individual entities, otherwise return count of items as product amount"
                  />
                )
                :
                (<FormControl.Static>{this.state.sum_amounts?'on':'off'}</FormControl.Static>)
              }
            </Col>
          </FormGroup>
          <FormGroup controlId="productAmount">
            <Col componentClass={ControlLabel} xs={4} sm={2} md={1} lg={2}>
              Amount
            </Col>
            <Col xs={8} sm={10} md={11} lg={10}>
              <FormControl.Static>{this.props.product.amount}</FormControl.Static>
            </Col>
          </FormGroup>
          <FormGroup controlId="productFirstStartedExpiry">
            <Col componentClass={ControlLabel} xs={4} sm={2} md={1} lg={2}>
              Open expires
            </Col>
            <Col xs={8} sm={10} md={11} lg={10}>
              <FormControl.Static>{this.props.product.first_started_ed}</FormControl.Static>
            </Col>
          </FormGroup>
        </Form>

        <ProductItemList
          elements={this.props.activeProductItems}
          toggleEditFn={this.props.toggleProductItemEditMode}
          modifyFn={this.props.modifyProductItem}
          addFn={this.props.addNewProductItem}
          editItemId={productItemEditId}
          productId={this.props.productId}
          active={true}
        />

        <ProductItemList
          elements={this.props.inActiveProductItems}
          productId={this.props.productId}
          active={false}
        />
      </Panel>
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
      editMode: (state.ui.get('productEditId') === id)? true:false,
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
