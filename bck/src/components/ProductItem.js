import React, { PropTypes, Component } from 'react'
// import { Link } from 'react-router'
// import { ListGroupItem, Glyphicon, Button, ButtonGroup, ButtonToolbar, Form, FormGroup, FormControl, Col, InputGroup } from 'react-bootstrap'

import { productItemsPropTypes } from '../tools/constants'
import {getISODate} from '../tools/common'

class ProductItem extends Component {
  static propTypes = {
    productItemsPropTypes,
    productId: PropTypes.number.isRequired,
    modifyFn: PropTypes.func,
    addFn: PropTypes.func,
    inactive: PropTypes.bool
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

const itemButtons = null
    // const itemButtons = (id !== -1)?
    //   (!inactive)?
    //     (
    //       <ButtonToolbar>
    //         <ButtonGroup>
    //           {
    //             (!this.props.is_started)?
    //               (<Button onClick={(e) => { this.modifyElement(e, {is_started:!this.props.is_started})}} bsStyle="info" bsSize="small" ><Glyphicon glyph="open" />{' '}Open</Button>)
    //               :
    //               (<Button onClick={(e) => { this.modifyElement(e, {is_started:!this.props.is_started})}} bsStyle="info" bsSize="small" ><Glyphicon glyph="save" />{' '}Close</Button>)
    //           }
    //         </ButtonGroup>
    //         <ButtonGroup>
    //           <Button onClick={(e) => { this.modifyElement(e, {amount:0})}} bsStyle="warning" bsSize="small" ><Glyphicon glyph="unchecked" />{' '}Empty</Button>
    //           <Button onClick={(e) => { this.modifyElement(e, {is_disposed:!this.props.is_disposed})}} bsStyle="danger" bsSize="small"><Glyphicon glyph="trash" />{' '}Dispose</Button>
    //         </ButtonGroup>
    //       </ButtonToolbar>
    //     )
    //     :
    //     null
    //   :
    //   (
    //     <ButtonGroup>
    //       <Button onClick={(e) => { this.props.addFn(this.state) }} bsStyle="success" bsSize="small" ><Glyphicon glyph="plus" />{' '}Add</Button>
    //     </ButtonGroup>
    //   )

    // simple ReadOnly representation of the item
    const itemUi = null
    // (
    //     <Form inline onSubmit={this.handleSubmit} onReset={this.cancelEdit}>
    //     <div className="row">
    //       <Col xs={6} sm={4} md={1} lg={3}>
    //         <FormGroup controlId="formInlineAmount" bsSize="small">
    //           <InputGroup bsSize="sm">
    //             <InputGroup.Addon>Amount</InputGroup.Addon>
    //             <FormControl type="number" name="amount" value={this.state.amount} onChange={(e) => {this.setState({amount: e.target.value})}} readOnly={inactive}/>
    //             { (id !== -1 && !inactive) &&
    //               (<InputGroup.Button><Button onClick={this.handleSubmit} bsStyle="primary" bsSize="xs" type="submit"><Glyphicon glyph="ok" /></Button></InputGroup.Button>)
    //             }
    //           </InputGroup>
    //         </FormGroup>
    //       </Col>
    //       <Col xs={6} sm={4} md={1} lg={3}>
    //         <FormGroup controlId="formInlineExpiry" bsSize="small">
    //           <InputGroup bsSize="sm">
    //             <InputGroup.Addon>Expiry</InputGroup.Addon>
    //             <FormControl type="date" readOnly={(id !== -1)?true:false}
    //               value={this.state.expiry_date}
    //               onChange={(e) => {this.setState({expiry_date: e.target.value})}}
    //             />
    //           </InputGroup>
    //         </FormGroup>
    //       </Col>
    //       <Col xs={6} sm={4} md={1} lg={3}>
    //         <FormGroup controlId="formInlineBought" bsSize="small">
    //           <InputGroup bsSize="sm">
    //             <InputGroup.Addon>Bought</InputGroup.Addon>
    //             <FormControl type="date" readOnly={(id !== -1)?true:false}
    //               value={this.state.create_date}
    //               onChange={(e) => {this.setState({create_date: e.target.value})}}
    //             />
    //           </InputGroup>
    //         </FormGroup>
    //       </Col>
    //       <Col lg={3}>
    //         {itemButtons}
    //       </Col>
    //       </div>
    //     </Form>
    //   )

    return (
      <li listItem disabled={inactive} bsStyle={(id === -1)?'success':(new Date(this.state.expiry_date) > new Date())?'info':'danger'}>
        {
          itemUi
        }
      </li>
    )
  }
}

export default ProductItem
