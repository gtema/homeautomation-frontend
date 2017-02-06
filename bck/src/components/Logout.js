// components/Logout.js

import React, { Component, PropTypes } from 'react'

// import 'purecss/build/buttons-min.css'
import Button from './Button'

export default class Logout extends Component {

  render() {
    const { onLogoutClick } = this.props

    return (
      <Button onClick={() => onLogoutClick()} componentClass="button-warning">
        Logout
      </Button>
    )
  }

}

Logout.propTypes = {
  onLogoutClick: PropTypes.func.isRequired
}
