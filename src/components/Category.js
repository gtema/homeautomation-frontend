import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { ListGroupItem, Glyphicon, Button, ButtonGroup, Form, FormGroup, FormControl } from 'react-bootstrap'

import { categoryPropTypes, cataloguePath } from '../tools/constants'

class Category extends Component {
  static propTypes = {
    categoryPropTypes,
    toggleEditFn: PropTypes.func.isRequired,
    modifyFn: PropTypes.func.isRequired,
    enableEdit: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state={name:props.name}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
  }

  handleChange(event) {
    this.setState({name:event.target.value})
  }

  cancelEdit(e) {
    e.preventDefault()
    this.props.toggleEditFn(null)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.modifyFn({
      "id": this.props.id,
      "parent_id": this.props.parent_id,
      "name": this.state.name
    });
    this.props.toggleEditFn(null);
  }

  render() {
    const { enableEdit, id, name, toggleEditFn, children } = this.props

    // Edit form for the item modification
    // <div className="container-fluid">
    const editItemUi = (
        <Form inline onSubmit={this.handleSubmit} onReset={this.cancelEdit}>
          <FormGroup controlId='name'>
            <FormControl type='text' name='name' value={this.state.name} onChange={ this.handleChange } />
          </FormGroup>
          <FormGroup>
            <ButtonGroup>
              <Button type="reset" bsStyle={'danger'} bsSize="xsmall">Cancel</Button>
              <Button type="submit" bsStyle={'primary'} bsSize="xsmall">Save</Button>
            </ButtonGroup>
          </FormGroup>
        </Form>
    )
    // </div>

    const header = null

    // simple ReadOnly representation of the item
    const roItemUi = (
        <div>
          <Link to={{
            pathname: cataloguePath + '/' + id
          }}>
            {name}
          </Link>
          { toggleEditFn &&
            <Button onClick={ () => { toggleEditFn(id)} } componentClass="btn-sm">
              <Glyphicon glyph="pencil" />
            </Button>
          }
          {children}
        </div>
      )

    return (
      <ListGroupItem
        header={header}
      >
        {
          enableEdit ?
            editItemUi : roItemUi
        }
      </ListGroupItem>
    )
  }
}

export default Category
