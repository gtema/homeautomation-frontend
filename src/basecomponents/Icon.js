import React from 'react'
import classnames from 'classnames';

import 'font-awesome/css/font-awesome.min.css'

class Icon extends React.Component {

  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  }

  render() {
    const classNames = classnames("fa", this.props.icon)
    const onClick = (this.props.onClick)? this.props.onClick : null

    return React.createElement(
      'i',
      Object.assign({}, {
        onClick: onClick,
        className: classNames,
      })
    )
  }
}

export default Icon
