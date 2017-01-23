import React from 'react'
import { Component, PropTypes } from 'react'
// import { categoryPropTypes, cataloguePath } from '../tools/constants'
// import { Link } from 'react-router'
// import { ListGroupItem, Glyphicon, Button, ButtonGroup, Form, FormGroup, FormControl } from 'react-bootstrap'
// import { concat, sortBy, map, sample, forEach } from 'lodash'
import CategoryTreeMenuNode from './CategoryTreeMenuNode'
// import { ListGroup } from 'react-bootstrap'
// import { categoryPropTypes, cataloguePath } from '../tools/constants'
import classnames from 'classnames'

import './CategoryTreeMenu.css'

class CategoryTreeMenu extends Component {

  static propTypes = {
    tree: PropTypes.arrayOf(PropTypes.object),
    toggleEditFn: PropTypes.func.isRequired,
    modifyFn: PropTypes.func.isRequired,
    addCategoryFn: PropTypes.func,
    editItemId: PropTypes.number,
    currentPathIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    collapsed: PropTypes.bool
  }

  static defaultProps = {
    collapsed: false
  }

  renderChild = element => {
    return element && (
      <CategoryTreeMenuNode
        key={element.id}
        {...element}
        toggleEditFn={this.props.toggleEditFn}
        modifyFn={this.props.modifyFn}
        addCategoryFn={this.props.addCategoryFn}
        editItemId={this.props.editItemId}
        enableEdit={(element.id === this.props.editItemId )? true:false}
        currentPathIds={this.props.currentPathIds}
        collapsed={!this.props.currentPathIds.includes(element.id)}
        />
     )
  }

  render() {
    const { tree } = this.props
    if (typeof (tree) !== 'undefined') {
      return (
          <ul className={classnames('nav nav-list nav-menu-list-style tree',
            {
              'hidden': this.props.collapsed
            })}
          >
            {
              tree
                .map(this.renderChild)
            }
          </ul>
        )
    } else {
      return null
    }
  }
}

export default CategoryTreeMenu
