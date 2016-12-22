import React, { PropTypes, Component } from 'react'
// import { Link } from 'react-router'
import { ListGroupItem, Glyphicon, Button, ButtonGroup, Form, FormGroup, FormControl, Col, ControlLabel, InputGroup, Checkbox } from 'react-bootstrap'

import { productItemsPropTypes } from '../tools/constants'
import {getISODate} from '../tools/common'

class ProductItem extends Component {
  static propTypes = {
    productItemsPropTypes,
    // id: PropTypes.number.isRequired,
    // product_id: PropTypes.number.isRequired,
    // amount: PropTypes.number,
    toggleEditFn: PropTypes.func.isRequired,
    modifyFn: PropTypes.func.isRequired,
    enableEdit: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state={
      amount: props.amount || 0,
      is_started: props.is_started,
      create_date: props.create_date,
      expiry_date: props.expiry_date
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
      id: this.props.id,
      product_id: this.props.product_id,
      is_started: this.state.is_started,
      amount: this.state.amount,
    });
    // this.props.toggleEditFn(null);
  }

  render() {
    const { enableEdit, id, toggleEditFn } = this.props

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


    // simple ReadOnly representation of the item
    const roItemUi = (
        <Form inline onSubmit={this.handleSubmit} onReset={this.cancelEdit}>
        <div className="row">
          <Col xs={6} sm={4} md={1} lg={2}>
            <FormGroup controlId="formInlineStarted" bsSize="small">
              <InputGroup bsSize="sm">
                <InputGroup.Addon>Started? </InputGroup.Addon>
                {' '}
                <InputGroup.Addon>
                <Checkbox type="checkbox" name="is_started" checked={this.state.is_started} onChange={(e) => {this.setState({is_started: e.target.checked})}}/>
                </InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={6} sm={4} md={1} lg={2}>
            <FormGroup controlId="formInlineAmount" bsSize="small">
              <InputGroup bsSize="sm">
                <InputGroup.Addon>Amount</InputGroup.Addon>
                <FormControl type="number" name="amount" value={this.state.amount} onChange={(e) => {this.setState({amount: e.target.value})}}/>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={6} sm={4} md={1} lg={2}>
            <FormGroup controlId="formInlineExpiry" bsSize="small">
              <InputGroup bsSize="sm">
                <InputGroup.Addon>Expiry</InputGroup.Addon>
                <FormControl type="date" readOnly value={getISODate(new Date(this.props.expiry_date))} />
              </InputGroup>
            </FormGroup>
          </Col>

          <Col xs={2} sm={2} md={2} lg={1}>
            {' '}
          </Col>
          <Col >
            <ButtonGroup>
              <Button onClick={this.handleSubmit} bsStyle="primary" bsSize="small" type="submit"><Glyphicon glyph="adjust" />{' '}Save</Button>
              <Button onClick={this.handleSubmit} bsStyle="info" bsSize="small" ><Glyphicon glyph="open" />{' '}Open</Button>
              <Button onClick={this.handleSubmit} bsStyle="warning" bsSize="small" ><Glyphicon glyph="unchecked" />{' '}Empty</Button>
              <Button onClick={this.handleSubmit} bsStyle="danger" bsSize="small"><Glyphicon glyph="trash" />{' '}Dispose</Button>
            </ButtonGroup>
          </Col>
          </div>
        </Form>
      )

    return (
      <ListGroupItem listItem>
        {
          enableEdit ?
            editItemUi : roItemUi
        }
      </ListGroupItem>
    )
  }
}

export default ProductItem
