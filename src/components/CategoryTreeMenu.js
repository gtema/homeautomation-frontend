import React from 'react'
import { Component, PropTypes } from 'react'
import { categoryPropTypes, cataloguePath } from '../tools/constants'
import { Link } from 'react-router'
import { ListGroupItem, Glyphicon, Button, ButtonGroup, Form, FormGroup, FormControl } from 'react-bootstrap'
import { concat, sortBy, map, sample, forEach } from 'lodash'
import CategoryTreeMenuNode from './CategoryTreeMenuNode'
import { ListGroup } from 'react-bootstrap'

class CategoryTreeMenu extends Component {

  static propTypes = {
    tree: PropTypes.arrayOf(PropTypes.object),
    toggleEditFn: PropTypes.func.isRequired,
    modifyFn: PropTypes.func.isRequired,
    editItemId: PropTypes.number
  }

  renderChild = element => {
    return element && (
      <CategoryTreeMenuNode
        key={element.id}
        {...element}
        toggleEditFn={this.props.toggleEditFn}
        modifyFn={this.props.modifyFn}
        editItemId={this.props.editItemId}
        enableEdit={(element.id === this.props.editItemId )? true:false}
        />
     )
  }

  render() {
    const { tree } = this.props
    if (typeof (tree) !== 'undefined') {
      return (
          <ul className="nav nav-list nav-menu-list-style tree" >
            {tree.map(this.renderChild)}
          </ul>
        )
    } else {
      return null
    }
  }
}

export default CategoryTreeMenu
