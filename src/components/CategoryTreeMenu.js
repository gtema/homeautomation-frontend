import React from 'react'
import { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import CategoryTreeMenuNode from './CategoryTreeMenuNode'

import 'purecss/build/menus-min.css'
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
          <ul className={classnames('pure-menu-list menu-list-tree',
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
