import React from 'react'
import classnames from 'classnames';

import './Button.css'
import 'purecss/build/buttons-min.css'

class Button extends React.Component {
  render() {
    const className = classnames("pure-button", this.props.className)
    const onClick = (this.props.onClick)? this.props.onClick : null
    const type = this.props.type || "button"
    const title = this.props.title || null

    return React.createElement(
      'button',
      Object.assign({}, {
        onClick: onClick,
        className: className,
        type: type,
        title: title
      }),
      this.props.children
    )

  }
}

export default Button
