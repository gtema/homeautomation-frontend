import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import Login from './Login'
import Logout from './Logout'
import { loginUser, logoutUser } from '../actions/auth'

import './Header.css'
import 'purecss/build/grids-responsive-min.css'

export default class Header extends Component {

  render() {
    const { dispatch, isAuthenticated, errorMessage } = this.props

    return (
      <div className="header">
        <div className="home-menu pure-menu pure-menu-horizontal" id="menu">
          <Link className="pure-menu-heading" to="/">HomeAutomation</Link>
          <a href="#" className="custom-toggle" id="toggle" onClick={(e) => {  e.preventDefault();}}>
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

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string
}
