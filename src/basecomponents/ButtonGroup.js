import React from 'react'

import 'purecss/build/buttons-min.css'

class ButtonGroup extends React.Component {

  render() {
    return React.createElement(
      'div',
      Object.assign({}, {
        "role": "group",
        "className": "pure-button-group",
        "aria-label": "Buttons..."
      }),
      this.props.children
    )

  }
}

export default ButtonGroup
