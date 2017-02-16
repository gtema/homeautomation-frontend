/*! basecomponents/Dropdown.js
*/
import React from 'react'
import Link from 'react-router/lib/Link'
import classnames from 'classnames'

class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      open: false,
    }
    this.toggle = this.toggle.bind(this)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  close() {
    this.setState({open: false})
  }

  open() {
    this.setState({open: true})
  }

  toggle(e) {
    if (this.state.open) {
      this.close()
    } else {
      this.open()
      this.timer = setTimeout(() => {
        this.close()
      }, 4000);
    }
  }

  render() {
    const classNames = classnames('pure-menu-item', 'pure-menu-has-children', this.props.className, {'pure-menu-active': this.state.open})
    const title = this.props.title || null

    return React.createElement(
        'a',
        Object.assign({
          'className': 'pure-menu-link',
          'data-toggle': 'dropdown',
          'aria-haspopup': true,
          'onClick': this.toggle,
        }),
        {title}
      ),
      // ul with children
      React.createElement(
        'ul',
        Object.assign({
          'className': 'pure-menu-children'
        }),
        this.props.children
      )

    )

  }
}

export default Dropdown
