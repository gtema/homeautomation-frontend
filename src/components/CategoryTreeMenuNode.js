import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { ListGroupItem, Glyphicon, Button, ButtonGroup, Form, FormGroup, FormControl } from 'react-bootstrap'

import { categoryPropTypes, cataloguePath } from '../tools/constants'
import CategoryTreeMenu from './CategoryTreeMenu'

class CategoryTreeMenuNode extends Component {
  static propTypes = {
    categoryPropTypes,
    children: PropTypes.arrayOf(PropTypes.object),
    toggleEditFn: PropTypes.func.isRequired,
    modifyFn: PropTypes.func.isRequired,
    enableEdit: PropTypes.bool,
    editItemId: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state={
      name:props.name,
      prio:props.prio
    }
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
      "name": this.state.name,
      "prio": this.state.prio,
    });
    this.props.toggleEditFn(null);
  }

  render() {
    const { enableEdit, id, name, toggleEditFn, children } = this.props

    // Edit form for the item modification
    const editItemUi = (
        <Form inline onSubmit={this.handleSubmit} onReset={this.cancelEdit}>
          <FormGroup controlId='name'>
            <FormControl type='text' name='name' value={this.state.name}
              onChange={ (e) => {this.setState({name: e.target.value})} } />
          </FormGroup>
          <FormGroup controlId='prio'>
            <FormControl type='number' name='prio' value={this.state.prio}
              onChange={ (e) => {this.setState({prio: e.target.value})} } />
          </FormGroup>
          <FormGroup>
            <ButtonGroup>
              <Button type="reset" bsStyle={'danger'} bsSize="xsmall">Cancel</Button>
              <Button type="submit" bsStyle={'primary'} bsSize="xsmall">Save</Button>
            </ButtonGroup>
          </FormGroup>
        </Form>
    )

    // simple ReadOnly representation of the item
    const roItemUi = (
        <label className="nav-header glyphicon-icon-rpad">

        { children &&
            <span className="tree-toggle menu-collapsible-icon glyphicon glyphicon-chevron-down" onClick={(e) => {
                    // const liChildren = e.target.parentElement.parentElement.childNodes
                    const currLi = e.target.parentElement.parentElement
                    const chevron = e.target
                    const childUl = currLi.getElementsByClassName("tree");
                    if (childUl.length >= 1) {
                      childUl[0].classList.toggle('hidden')
                      chevron.classList.toggle('glyphicon-chevron-down')
                      chevron.classList.toggle('glyphicon-chevron-right')
                    } else {
                      console.warn("no parent", childUl.length, currLi, chevron, childUl);
                    }
                  }
                  }>
            </span>
          }

          <Link to={{
            pathname: cataloguePath + '/' + id
          }}>
            {name}
          </Link>
          { toggleEditFn &&
            <span className="pull-right">
              <Button onClick={ () => { toggleEditFn(id)} } componentClass="btn-sm">
                <Glyphicon glyph="pencil" />
              </Button>
            </span>
          }

        </label>
      )

    return (
      <ListGroupItem bsClass="" listItem >
        {
          enableEdit ?
            editItemUi : roItemUi
        }
        {children &&
          <CategoryTreeMenu
            tree={children}
            toggleEditFn={this.props.toggleEditFn}
            modifyFn={this.props.modifyFn}
            editItemId={this.props.editItemId}
             />
        }
      </ListGroupItem>
    )
  }
}

export default CategoryTreeMenuNode
