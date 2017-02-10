import React, { Component, PropTypes } from 'react'

import Modal from '../basecomponents/Modal'
import Button from '../basecomponents/Button'

class AddCategoryImpl Component {
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
      <Modal isVisible={this.props.visible} onClose={ this.handleCancel }>
        <Modal.Header>Add Category</Modal.Header>
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
    // return (
    //   <Modal.Dialog>
    //     <Modal.Header>
    //       <Modal.Title>Add Category</Modal.Title>
    //     </Modal.Header>
    //
    //     <Modal.Body>
    //       <Form inline>
    //         <FormGroup controlId='name'>
    //           <ControlLabel>Name</ControlLabel>
    //           {' '}
    //           <FormControl type='text' name='name' value={this.state.name} onChange={ this.handleChange } />
    //         </FormGroup>
    //       </Form>
    //     </Modal.Body>
    //
    //     <Modal.Footer>
    //       <Button onClick={ this.handleCancel }>Close</Button>
    //       <Button bsStyle="primary" onClick={ this.handleSubmit }>Save changes</Button>
    //     </Modal.Footer>
    //
    //   </Modal.Dialog>
    // )
  }

}
export default AddCategoryImpl
