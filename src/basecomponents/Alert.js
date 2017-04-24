import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './Alert.css'

class Alert extends React.Component {

  static propTypes = {
    type: PropTypes.oneOf(['info', 'warning', 'error']).isRequired
  }

  static defaultProps = {
    type: 'info'
  }

  constructor(props) {
    super(props)
    this.state = {
      hidden: (typeof(props.children) !== 'undefined' && props.children !== '')? false: true,
      type: 'info',
      content: props.children
    }
    this.hide = this.hide.bind(this)
  }

  componentWillReceiveProps(newProps) {
    const content = newProps.children
    if (content !== this.state.content && typeof(content) !== 'undefined' && content !== '') {
      this.setState({
        hidden: false,
        content: content
      })
    }
  }

  hide() {
    this.setState({
      hidden: true,
      content: null,
    })
  }

  render() {
    const classNames = classnames(
      'alert',
      `alert-${this.props.type}`,
      {'alert-hidden': this.state.hidden}
    )

    return React.createElement(
      'div',
      {
        className: classNames,
        role: 'alert',
      },
      React.createElement(
        'span',
        Object.assign({}, {
            className: 'alert-close',
            role: 'alert',
            onClick: this.hide
          }
        ),
        '\xD7'
      ),
      this.state.content
    )

  }
}

export default Alert
