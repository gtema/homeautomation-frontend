import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Button, Modal, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import * as UIActionCreators from '../actions/ui'
import * as CategoriesActionCreators from '../actions/categories'
import * as ProductActionCreators from '../actions/products'


class AddCategoryImpl extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    parent_id: PropTypes.number.isRequired
  }

  static defaultProps = {
    visible: false,
    parent_id: 0
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
    e.preventDefault()
    this.props.toggleAddCategoryMode()
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.addNewCategory(this.state.name, this.props.parent_id);
    this.props.toggleAddCategoryMode();
  }

  render () {
    if (!this.props.visible) {
      return null
    }

    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form inline>
            <FormGroup controlId='name'>
              <ControlLabel>Name</ControlLabel>
              {' '}
              <FormControl type='text' name='name' value={this.state.name} onChange={ this.handleChange } />
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={ this.handleCancel }>Close</Button>
          <Button bsStyle="primary" onClick={ this.handleSubmit }>Save changes</Button>
        </Modal.Footer>

      </Modal.Dialog>
    )
  }

}
const mapStateToProps = (state, ownProps) => {
  return {
    visible: state.ui.get('categoryAddMode'),
    parent_id: state.ui.get('selectedCategoryId')
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, UIActionCreators, CategoriesActionCreators, ProductActionCreators), dispatch)
}

const AddCategoryWidget = connect(mapStateToProps, mapDispatchToProps)(AddCategoryImpl)

export default AddCategoryWidget
