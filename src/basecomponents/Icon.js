import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames';

import 'font-awesome/css/font-awesome.min.css'

class Icon extends React.Component {

  static propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func
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
