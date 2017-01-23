import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { Glyphicon, Button, ButtonGroup, Form, FormGroup, FormControl } from 'react-bootstrap'

import { categoryPropTypes, cataloguePath } from '../tools/constants'
import CategoryTreeMenu from './CategoryTreeMenu'
import classnames from 'classnames'

class CategoryTreeMenuNode extends Component {
  static propTypes = {
    categoryPropTypes,
    children: PropTypes.arrayOf(PropTypes.object),
    toggleEditFn: PropTypes.func.isRequired,
    modifyFn: PropTypes.func.isRequired,
    addCategoryFn: PropTypes.func,
    enableEdit: PropTypes.bool,
    editItemId: PropTypes.number,
    currentPathIds: PropTypes.arrayOf(PropTypes.number),
    collapsed: PropTypes.bool,
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
    /* Filter only required attributes */
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
        <Form onSubmit={this.handleSubmit} onReset={this.cancelEdit}>
          <FormGroup controlId='name'>
            <FormControl type='text' name='name' value={this.state.name}
              onChange={ (e) => {this.setState({name: e.target.value})} } />
          </FormGroup>
          <FormGroup controlId='prio'>
            <FormControl type='number' name='prio' value={this.state.prio}
              onChange={ (e) => {this.setState({prio: e.target.value})} } />
          </FormGroup>
            <ButtonGroup justified>
              <ButtonGroup>
              <Button type="reset" bsStyle={'warning'} bsSize="xsmall" title="Cancel">
                <Glyphicon glyph="remove"/>
              </Button>
              </ButtonGroup>
              <ButtonGroup>
              <Button type="button" bsStyle={'success'} bsSize="xsmall" title="Add Subcategory"
                onClick={(e) => { e.preventDefault(); this.props.addCategoryFn(id)}}>
                <Glyphicon glyph="plus"/>
              </Button>
              </ButtonGroup>
              <ButtonGroup>
              <Button type="submit" bsStyle={'primary'} bsSize="xsmall" title="Save changes">
                <Glyphicon glyph="ok"/>
              </Button>
              </ButtonGroup>
            </ButtonGroup>
        </Form>
    )
    // <FormGroup controlId='buttons'>
    // </FormGroup>

    // simple ReadOnly representation of the item
      const roItemUi = (
            <Link
                to={{pathname: cataloguePath + '/' + id}}
                activeClassName="active"
              >
              { children &&
                <span
                  className={
                    classnames("tree-toggle menu-collapsible-icon glyphicon",
                        {
                          'glyphicon-menu-down': !this.props.collapsed,
                          'glyphicon-menu-right': this.props.collapsed,
                        }
                    )
                  }
                  onClick={(e) => {
                    // const liChildren = e.target.parentElement.parentElement.childNodes
                    e.preventDefault()
                    const currLi = e.target.parentElement.parentElement
                    const chevron = e.target
                    const childUl = currLi.getElementsByClassName("tree");
                    if (childUl.length >= 1) {
                      childUl[0].classList.toggle('hidden')
                      chevron.classList.toggle('glyphicon-menu-down')
                      chevron.classList.toggle('glyphicon-menu-right')
                    } else {
                      console.warn("no parent", childUl.length, currLi, chevron, childUl);
                    }
                    }
                  }
                  aria-hidden="true"
                  />
              }
              {name}
              { toggleEditFn &&
                <span className="pull-right">
                  <Button onClick={ (e) => { e.preventDefault(); toggleEditFn(id)} } componentClass="btn-sm" aria-label="Edit">
                    <Glyphicon glyph="pencil" aria-label="edit"/>
                  </Button>
                </span>
              }
          </Link>
        )

        // <ButtonGroup bsClass="pull-right">
        //   <Button onClick={ (e) => { e.preventDefault(); this.props.addCategoryFn(id)} } componentClass="btn-sm" aria-label="Add">
        //     <Glyphicon glyph="plus" aria-label="add"/>
        //     </Button>
        // { toggleEditFn &&
        //     <Button onClick={ (e) => { e.preventDefault(); toggleEditFn(id)} } componentClass="btn-sm" aria-label="Edit">
        //       <Glyphicon glyph="pencil" aria-label="edit"/>
        //     </Button>
        // }
        // </ButtonGroup>

    return (
      <li className={classnames({"current": this.props.currentPathIds.includes(this.props.id)})}>
        {
          enableEdit ?
            editItemUi :
            roItemUi
        }
        {children &&
          <CategoryTreeMenu
            tree={children}
            toggleEditFn={this.props.toggleEditFn}
            modifyFn={this.props.modifyFn}
            addCategoryFn={this.props.addCategoryFn}
            editItemId={this.props.editItemId}
            currentPathIds={this.props.currentPathIds}
            collapsed={!this.props.currentPathIds.includes(this.props.id)}
             />
        }
      </li>
    )
  }
}

export default CategoryTreeMenuNode
