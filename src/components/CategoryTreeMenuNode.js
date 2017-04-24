/* components/CategoryTreeMenuNode.js */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'react-router/lib/Link'

import 'purecss/build/forms-min.css'
import ButtonGroup from '../basecomponents/ButtonGroup'
import Button from '../basecomponents/Button'
import Icon from '../basecomponents/Icon'

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
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = (target.type === 'checkbox') ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]:value
    })
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
        <form onSubmit={this.handleSubmit} onReset={this.cancelEdit} className="pure-form pure-form-aligned">
          <fieldset>
            <div className="pure-control-group">
              <input type="text" name="name" value={this.state.name}
                onChange={ this.handleInputChange }
              />
            </div>
            <div className="pure-control-group">
              <input type="number" name="prio" value={this.state.prio}
                onChange={ this.handleInputChange  }
              />
            </div>
            <ButtonGroup>
              <Button
                title="Cancel"
                type="cancel"
                className="button-small bg-warning"
              >
                <Icon icon="fa-undo" />
              </Button>
              <Button
                title="Add Subcategory"
                className="button-small bg-success"
                onClick={(e) => { e.preventDefault(); this.props.addCategoryFn(id)}}
              >
                <Icon icon="fa-plus" />
              </Button>
              <Button
                title="Save changes"
                type="submit"
                className="button-small bg-primary"
              >
                <Icon icon="fa-check" />
              </Button>
            </ButtonGroup>
          </fieldset>
        </form>
    )

    // simple ReadOnly representation of the item
      const roItemUi = (
          <Link
              className="pure-menu-link"
              to={{pathname: cataloguePath + '/' + id}}
              activeClassName="active"
            >
            { children &&
              <span
                className={
                  classnames("tree-toggle menu-collapsible-icon fa",
                      {
                        'fa-minus': !this.props.collapsed,
                        'fa-plus': this.props.collapsed,
                      }
                  )
                }
                onClick={(e) => {
                  // const liChildren = e.target.parentElement.parentElement.childNodes
                  e.preventDefault()
                  const currLi = e.target.parentElement.parentElement
                  const chevron = e.target
                  const childUl = currLi.getElementsByClassName("menu-list-tree");
                  if (childUl.length >= 1) {
                    childUl[0].classList.toggle('hidden')
                    chevron.classList.toggle('fa-plus')
                    chevron.classList.toggle('fa-minus')
                  } else {
                    console.warn("no parent", childUl.length, currLi, chevron, childUl);
                  }
                }
                }
                aria-hidden="true"
                />
              }
              { toggleEditFn &&
                <span className="badge">
                  <Button onClick={ (e) => { e.preventDefault(); toggleEditFn(id)} } className="button-xsmall" aria-label="Edit">
                    <Icon icon="fa-pencil" aria-label="edit"/>
                  </Button>
                </span>
              }
              {name}
            </Link>
        )

    return (
      <li className={classnames("pure-menu-item menu-item", {"current": this.props.currentPathIds.includes(this.props.id)})}>
        {
          enableEdit ?
            editItemUi :
            (
              roItemUi
            )
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
