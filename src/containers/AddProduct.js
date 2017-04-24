import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Modal from '../basecomponents/Modal'
import Button from '../basecomponents/Button'

import * as UIActionCreators from '../actions/ui'
import * as ProductActionCreators from '../actions/products'


class AddProductImpl extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    category_id: PropTypes.number.isRequired
  }

  static defaultProps = {
    visible: false,
    category_id: 0
  }

  constructor(props) {
    super(props)
    this.state={name:'default'}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleChange(event) {
    this.setState({name:event.target.value})
  }

  handleCancel(e) {
    // e.preventDefault()
    this.props.toggleAddProductMode()
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.addNewProduct(this.state.name, this.props.category_id);
    this.props.toggleAddProductMode();
  }

  render () {
    if (!this.props.visible) {
      return null
    }

    return (
      <Modal isVisible={this.props.visible} onClose={ this.handleCancel }>
        <Modal.Header>Add Product</Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmit} onReset={this.cancelEdit} className="pure-form pure-form-aligned">
              <div className="pure-control-group">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={this.state.name}
                  onChange={ this.handleChange }
                />
              </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
              <Button onClick={ this.handleCancel }>Close</Button>
              <Button onClick={ this.handleSubmit }>Save changes</Button>
        </Modal.Footer>
      </Modal>
    )
  }

}
const mapStateToProps = (state, ownProps) => {
  return {
    visible: state.ui.get('productAddMode'),
    category_id: state.ui.get('selectedCategoryId')
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, UIActionCreators, ProductActionCreators), dispatch)
}

const AddProductWidget = connect(mapStateToProps, mapDispatchToProps)(AddProductImpl)

export default AddProductWidget
