import React from 'react'
import classnames from 'classnames'

import ButtonGroup from '../basecomponents/ButtonGroup'
import Button from '../basecomponents/Button'
import Icon from '../basecomponents/Icon'

import 'purecss/build/forms-nr-min.css'
// import 'purecss/build/grids-min.css'
import 'purecss/build/grids-responsive-min.css'

import { productItemsPropTypes } from '../tools/constants'
import {getISODate} from '../tools/common'

class ProductItem extends React.Component {
  static propTypes = {
    productItemsPropTypes,
    productId: React.PropTypes.number.isRequired,
    modifyFn: React.PropTypes.func,
    addFn: React.PropTypes.func,
    inactive: React.PropTypes.bool
  }

  static defaultProps = {
    inactive: false,
  }

  constructor(props) {
    super(props)
    this.state={
      id: props.id,
      product_id: props.product_id || props.productId,
      amount: (props.id !== -1)? props.amount : 1,
      is_started: props.is_started || false,
      is_disposed: props.is_disposed || false,
      create_date: (props.create_date)? getISODate(new Date(props.create_date)) : getISODate(new Date()),
      expiry_date: (props.expiry_date)? getISODate(new Date(props.expiry_date)) : getISODate(new Date()),
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    //this.modifyElement = this.modifyElement.bind(this)
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
    this.props.modifyFn({
      id: this.props.id,
      product_id: this.props.product_id,
      is_started: this.state.is_started,
      amount: this.state.amount,
    });
    // this.props.toggleEditFn(null);
  }

  modifyElement(e, valueHash) {
    e.preventDefault()
    var newValues = Object.assign({}, this.props, valueHash)
    this.props.modifyFn(newValues)
  }

  render() {
    const { id } = this.props

    const inactive = this.props.inactive

    const itemButtons = (id !== -1)?
      (!inactive)?
        (
          <div className="button-toolbar">
            <ButtonGroup>
              {
                (!this.props.is_started)?
                  (
                    <Button
                        onClick={(e) => { this.modifyElement(e, {is_started:!this.props.is_started})}}
                        className="button-small bg-info">
                      <Icon icon="fa-cut"/>
                      <span className="hidden-sm">Open</span>
                    </Button>
                  )
                  :
                  (
                    <Button
                        onClick={(e) => { this.modifyElement(e, {is_started:!this.props.is_started})}}
                        className="button-small bg-info">
                      <Icon icon="fa-save" />
                      <span className="hidden-sm">Close</span>
                    </Button>
                  )
              }
            </ButtonGroup>
            <ButtonGroup>
              <Button onClick={this.handleSubmit}
                  className="button-small bg-success">
                <Icon icon="fa-save" />
                <span className="hidden-sm">Save</span>
              </Button>
              <Button onClick={(e) => { this.modifyElement(e, {amount:0})}}
                  className="button-small bg-warning">
                <Icon icon="fa-battery-empty" /><span className="hidden-sm">Empty</span>
              </Button>
              <Button onClick={(e) => { this.modifyElement(e, {is_disposed:!this.props.is_disposed})}}
                  className="button-small bg-danger">
                <Icon icon="fa-trash" />
                <span className="hidden-sm">Dispose</span>
              </Button>
            </ButtonGroup>
          </div>
        )
        :
        null
      :
      (
        <ButtonGroup>
          <Button onClick={(e) => { this.props.addFn(this.state) }} className="button-small bg-success" >
            <Icon icon="fa-plus" />
            <span className="hidden-sm">Add</span>
          </Button>
        </ButtonGroup>
      )

    // simple ReadOnly representation of the item
    const itemUi =
    (
      <form onSubmit={this.handleSubmit} onReset={this.cancelEdit} className="pure-form" disabled={inactive}>
          <div className="pure-g">

            <div className="pure-u-sm-1-1 pure-u-md-1-2 pure-u-lg-6-24 pure-u-xl-6-24">
              <div className="input-group">
                <span className="input-group-addon">Amount</span>
                <input type="number" name="amount" value={this.state.amount}
                  onChange={ this.handleInputChange } disabled={inactive}
                />
              </div>
            </div>

            <div className="pure-u-sm-1-1 pure-u-md-1-2 pure-u-lg-6-24 pure-u-xl-6-24">
              <div className="input-group">
                <span className="input-group-addon">Expiry</span>
                <input type="date" name="expiry_date" value={this.state.expiry_date}
                  onChange={ this.handleInputChange } disabled={inactive}
                />
              </div>
            </div>

            <div className="pure-u-sm-1-1 pure-u-md-1-2 pure-u-lg-6-24 pure-u-xl-6-24">
              <div className="input-group">
                <span className="input-group-addon">Bought</span>
                <input type="date" name="create_date" value={this.state.create_date}
                  onChange={ this.handleInputChange } disabled={inactive}
                />
              </div>
            </div>

            <div className="pure-u-sm-1-1 pure-u-md-1-2 pure-u-lg-6-24 pure-u-xl-6-24">
              {itemButtons}
            </div>

          </div>
      </form>
    )

    return (
      <li className={
          classnames({
            'item-new':id === -1 && !inactive,
            'item-expiry':id !== -1 && !inactive && new Date(this.state.expiry_date) > new Date(),
            'item-current':id !== -1 && !inactive && new Date(this.state.expiry_date) <= new Date(),
            'item-old':inactive
          })
        }
      >
        {itemUi}
      </li>
    )
  }
}

export default ProductItem
