// import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// import { Button, Modal, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import * as UIActionCreators from '../actions/ui'
import * as CategoriesActionCreators from '../actions/categories'
import * as ProductActionCreators from '../actions/products'
import AddCategoryImpl from '../components/AddCategory'

const mapStateToProps = (state, ownProps) => {
  return {
    visible: state.ui.get('categoryAddMode'),
    parent_id: state.ui.get('categoryAddParentId')
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, UIActionCreators, CategoriesActionCreators, ProductActionCreators), dispatch)
}

const AddCategoryWidget = connect(mapStateToProps, mapDispatchToProps)(AddCategoryImpl)

export default AddCategoryWidget
