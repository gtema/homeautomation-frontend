import React, { PropTypes } from 'react'
import { Button, Modal, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

const AddCategoryWidget = ({ visible, toggleAddCategoryMode, addNewCategory }) => {
  if (!visible) {
    return null
  }
  let input
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
            <input type="text" ref={(input) => this.input = input} />
          </FormGroup>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => { toggleAddCategoryMode() }}>Close</Button>
        <Button bsStyle="primary" onClick={(e) => {console.log(e)} }>Save changes</Button>
      </Modal.Footer>

    </Modal.Dialog>
  )
}
// <div>
// Add the category
// <Form horizontal onSubmit={e=> {
//   e.preventDefault()
//
//   var form = new FormData(e.target);
//   if (!form) {
//     return
//   }
//
//   dispatch(addCategory(form.get("name"), params.groupId))
// }}>
// <FormGroup controlId='name'>
// <Col md={2}>
// <ControlLabel>Name</ControlLabel>
// </Col>
// <Col md={10}>
// <FormControl componentClass='input' type='text' name="name"/>
// </Col>
// </FormGroup>
// <FormGroup>
// <Col md={2}>
// <LinkContainer
// to={{
//   pathname:cataloguePath + '/' + params.groupId
// }}>
// <Button>Go Back</Button>
// </LinkContainer>
// </Col>
// <Col md={2}>
// <Button type="submit"
// bsStyle={'primary'}>Add</Button>
// </Col>
// </FormGroup>
// </Form>
//
// </div>

// AddCategory = connect()(AddCategoryImpl)

AddCategoryWidget.propTypes = {
  visible: PropTypes.bool.isRequired,
  ui: PropTypes.object
}
export default AddCategoryWidget
