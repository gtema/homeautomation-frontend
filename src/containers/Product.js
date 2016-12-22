import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { browserHistory } from 'react-router'
import { Panel, Glyphicon, Button, ButtonGroup, Form, FormGroup, FormControl, InputGroup, Col, ControlLabel } from 'react-bootstrap'

import * as UIActionCreators from '../actions/ui'
import * as CategoriesActionCreators from '../actions/categories'
import * as ProductActionCreators from '../actions/products'
import * as ProductItemsActionCreators from '../actions/productItems'
import { productPropTypes, productItemsPropTypes, cataloguePath } from '../tools/constants'
// import Spinner from '../components/Spinner'
import {getISODate} from '../tools/common'

import { getCurrentProduct, getProductItemsByProductId } from '../selectors/Catalogue'

import ProductItemList from '../components/ProductItemList'

// Single Product presentation
class ProductImpl extends Component {

  static propTypes = {
    product: productPropTypes,
    product_items: PropTypes.arrayOf(productItemsPropTypes),
  }

  static defaultProps = {
      product: {name:'', id: 0, category_id: 0}
  }

  constructor(props) {
    super(props)
    this.state={
      name: (props.product)? props.product.name : '',
      volume: (props.volume)? props.product.volume : '',
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
    if (nextProps.productId !== this.props.productId) {
      // this.props.requestProductIfNeeded(nextProps.productId);
      this.props.loadProductByProductIdIfNeeded(nextProps.productId)
      this.props.loadProductItemsByProductIdIfNeeded(nextProps.productId);
    }
    if (nextProps.product.name !== this.state.name) {
      this.setState({name:nextProps.product.name})
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
            <Col componentClass={ControlLabel} xs={4} sm={2} md={1} lg={1}>
              Name
            </Col>
            <Col xs={8} sm={10} md={11} lg={11}>
              <FormControl type='text' name='productName' value={this.state.name} onChange={(e) => { this.setState({name:e.target.value}) } } readOnly={!editMode} />
            </Col>
          </FormGroup>
          <FormGroup controlId="productVolume">
            <Col componentClass={ControlLabel} xs={4} sm={2} md={1} lg={1}>
              Volume
            </Col>
            <Col xs={8} sm={10} md={11} lg={11}>
              <FormControl type='text' name='productVolume' value={this.state.volume} onChange={(e) => { this.setState({volume:e.target.value}) } } readOnly={!editMode} />
            </Col>
          </FormGroup>
          <FormGroup controlId="productFirstStartedExpiry">
            <Col componentClass={ControlLabel} xs={4} sm={2} md={1} lg={1}>
              Open expires
            </Col>
            <Col xs={8} sm={10} md={11} lg={11}>
              <FormControl type='date' name='productFirstStartedExpiry' value={getISODate(new Date(product.first_started_ed))} readOnly/>
            </Col>
          </FormGroup>
        </Form>

        <ProductItemList
          elements={this.props.product_items}
          toggleEditFn={this.props.toggleProductItemEditMode}
          modifyFn={this.props.modifyProductItem}
          editItemId={productItemEditId}
          />
      </Panel>
    )
  }
}

const mapStateToProps = ( state, ownProps ) => {
  const id = parseInt(ownProps.params.itemId, 10);
  return {
    productId: id,
    product: getCurrentProduct(state, ownProps),//state.products.getIn(['selectedProduct', 'product']),
    product_items: getProductItemsByProductId(state, ownProps),
    editMode: (state.ui.get('productEditId') === id)? true:false,
    productItemEditId: state.ui.get('productItemEditId')
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, UIActionCreators, CategoriesActionCreators, ProductActionCreators, ProductItemsActionCreators), dispatch)
}

const Product = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductImpl)

export default Product
