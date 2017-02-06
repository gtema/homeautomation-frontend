import React, {PropTypes} from 'react'
import classnames from 'classnames';

import './Button.css'
import 'purecss/build/buttons-min.css'

var Button = React.createClass({
  render: function() {
    const classNames = classnames("pure-button", this.props.componentClass)
    const onClick = (this.props.onClick)? this.props.onClick : null
    const type = this.props.type || "button"
    const title = this.props.title || null
    return (
      <button
        className={classNames}
        onClick={onClick}
        title={title}
        >
          {this.props.children}
      </button>
    );
  }
});

export default Button
