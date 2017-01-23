import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Navbar, FormGroup, FormControl, Button, Glyphicon } from 'react-bootstrap'

import * as UIActionCreators from '../actions/ui'
import * as CategoriesActionCreators from '../actions/categories'
import * as ProductActionCreators from '../actions/products'
import * as ProductItemsActionCreators from '../actions/productItems'

// App Search
class AppSearchImpl extends Component {

  static propTypes = {
    // product: productPropTypes,
    // activeProductItems: PropTypes.arrayOf(productItemsPropTypes),
    // inActiveProductItems: PropTypes.arrayOf(productItemsPropTypes),
  }

  static defaultProps = {
      // product: {name:'', id: 0, category_id: 0}
  }

  constructor(props) {
    super(props)
    // this.state={
    //   'name': (props.product)? props.product.name : '',
    //   'volume': (props.product)? props.product.volume : 'x',
    //   'first_started_ed': (props.product.first_started_ed)? getISODate(new Date(props.product.first_started_ed)) : '',
    //   'sum_amounts': (props.product)? props.product.sum_amounts: true,
    // }
    // this.handleChange = this.handleChange.bind(this)
    // this.handleSubmit = this.handleSubmit.bind(this)
    // this.cancelEdit = this.cancelEdit.bind(this)
  }

  // handleChange(event) {
  //   this.setState({name:event.target.value})
  // }
  //
  // cancelEdit(e) {
  //   e.preventDefault()
  //   this.props.toggleProductEditMode(null)
  // }
  //
  // handleSubmit(e) {
  //   e.preventDefault()
  //   this.props.modifyProduct({
  //     id : this.props.product.id,
  //     category_id : this.props.product.category_id,
  //     name : this.state.name,
  //     volume : this.state.volume,
  //     sum_amounts : this.state.sum_amounts,
  //   });
  //   this.props.toggleProductEditMode(null);
  // }

  render() {


    return (
      <Navbar.Form pullRight>
        <FormGroup>
          <FormControl type="text" placeholder="Filter" onChange={(e) => this.props.search(e.target.value)}/>
        </FormGroup>
        {' '}
        <Button type="submit" componentClass="btn-sm"><Glyphicon glyph="search" /></Button>
      </Navbar.Form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // const id = parseInt(ownProps.params.itemId, 10);
  return {
    // productId: id,
    // product: product(state, ownProps),
    // activeProductItems: activeItems(state, ownProps),
    // inActiveProductItems: inActiveItems(state, ownProps),
    // editMode: (state.ui.get('productEditId') === id)? true:false,
    // productItemEditId: state.ui.get('productItemEditId')
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
      Object.assign({},
        UIActionCreators, CategoriesActionCreators, ProductActionCreators, ProductItemsActionCreators),
      dispatch)
}

const AppSearch = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppSearchImpl)

export default AppSearch
