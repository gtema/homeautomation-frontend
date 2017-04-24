import React from 'react'
import classnames from 'classnames'

import './Button.css'
import 'purecss/build/buttons-min.css'

var Button = React.createClass({
  render: function() {
    const className = classnames("pure-button", this.props.className)
    const onClick = (this.props.onClick)? this.props.onClick : null
    const type = this.props.type || "button"
    const title = this.props.title || null
    return (
      <button
        className={className}
        onClick={onClick}
        title={title}
        >
          {this.props.children}
      </button>
    );
  }
});

export default Button
