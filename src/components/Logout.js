// components/Logout.js
import React from 'react'

import Button from '../basecomponents/Button'

class Logout extends React.Component {

  static propTypes = {
    onLogoutClick: React.PropTypes.func.isRequired
  }

  render() {
    const { onLogoutClick } = this.props

    return (
      <Button onClick={() => onLogoutClick()} className="button-warning">
        Logout
      </Button>
    )
  }
}

export default Logout
