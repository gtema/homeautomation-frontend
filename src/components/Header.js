//components/Header.js
import React from 'react'

import Link from 'react-router/lib/Link'

import Logout from './Logout'
import { logoutUser } from '../actions/auth'

import 'purecss/build/menus-min.css'
import './Header.css'

/* App header*/
class Header extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired
  }

  render() {
    const { dispatch } = this.props

    return (
      <div className="header">
        <div className="home-menu pure-menu pure-menu-horizontal" id="menu">
          <Link className="pure-menu-heading" to="/">HomeAutomation</Link>
          <a href="#" className="custom-menu-toggle" id="toggle" onClick={(e) => { e.preventDefault() }}>
            <s className="bar"></s><s className="bar"></s></a>
          <ul className="pure-menu-list">
            <li className="pure-menu-item"><Link className="pure-menu-link" to="/cat">Catalogue</Link></li>
            <li className="pure-menu-item"><Logout onLogoutClick={() => dispatch(logoutUser()) }/></li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Header
