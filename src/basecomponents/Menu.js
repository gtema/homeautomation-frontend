import React from 'react'
import Link from 'react-router/lib/Link'
import classnames from 'classnames'

import './Menu.css'

class MenuItem extends React.Component {
  render() {
    const className = classnames('pure-menu-item', this.props.className)

    return React.createElement(
      'li',
      Object.assign({}, {
        'className': className,
      }),
      (<Link className='pure-menu-link' activeClassName='link-active' onClick={this.props.onClick || null} to={this.props.to} role='presentation' >{this.props.children}</Link>)

    )
  }
}

class MenuDropdown extends React.Component {
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
      'li',
      Object.assign({}, {
        'className': classNames,
        'onClick': this.toggle,
        'aria-hidden': true,
        // aria-role: 'presentation'
      }),
      // Link
      (<Link className='pure-menu-link' aria-haspopup={true}>{title}</Link>),
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

class Menu extends React.Component {
  render() {
    const classNames = classnames('pure-menu-list', this.props.className)
    return React.createElement(
      'ul',
      Object.assign({
        className: classNames
      }),
      this.props.children
    )

  }
}

Menu.Item = MenuItem
Menu.DropdownItem = MenuDropdown

export default Menu
