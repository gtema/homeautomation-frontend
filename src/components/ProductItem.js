import React from 'react'
import classnames from 'classnames'

import ButtonGroup from '../basecomponents/ButtonGroup'
import Button from '../basecomponents/Button'
import Icon from '../basecomponents/Icon'

import 'purecss/build/forms-min.css'
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
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    //this.modifyElement = this.modifyElement.bind(this)
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
                        className="button-small button-info">
                      <Icon icon="fa-cut"/>
                      {' '}Open
                    </Button>
                  )
                  :
                  (
                    <Button
                        onClick={(e) => { this.modifyElement(e, {is_started:!this.props.is_started})}}
                        className="button-small button-info">
                      <Icon icon="fa-save" />
                      {' '}Close
                    </Button>
                  )
              }
            </ButtonGroup>
            <ButtonGroup>
              <Button onClick={(e) => { this.modifyElement(e, {amount:0})}}
                  className="button-small button-warning">
                <Icon icon="fa-battery-empty" />{' '}Empty
              </Button>
              <Button onClick={(e) => { this.modifyElement(e, {is_disposed:!this.props.is_disposed})}}
                  className="button-small button-danger">
                <Icon icon="fa-trash" />{' '}Dispose
              </Button>
            </ButtonGroup>
          </div>
        )
        :
        null
      :
      (
        <ButtonGroup>
          <Button onClick={(e) => { this.props.addFn(this.state) }} className="button-small button-success" ><Icon icon="fa-plus" />{' '}Add</Button>
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
                  onChange={(e) => {this.setState({amount: e.target.value})}} disabled={inactive}
                />
              </div>
            </div>

            <div className="pure-u-sm-1-1 pure-u-md-1-2 pure-u-lg-6-24 pure-u-xl-6-24">
              <div className="input-group">
                <span className="input-group-addon">Expiry</span>
                <input type="date" name="expiry" value={this.state.expiry_date}
                  onChange={(e) => {this.setState({expiry_date: e.target.value})}} disabled={inactive}
                />
              </div>
            </div>

            <div className="pure-u-sm-1-1 pure-u-md-1-2 pure-u-lg-6-24 pure-u-xl-6-24">
              <div className="input-group">
                <span className="input-group-addon">Bought</span>
                <input type="date" name="expiry" value={this.state.create_date}
                  onChange={(e) => {this.setState({create_date: e.target.value})}} disabled={inactive}
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
