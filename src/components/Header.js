//components/Header.js
import React from 'react'
import Link from 'react-router/lib/Link'

import Menu from '../basecomponents/Menu'

import 'purecss/build/menus-min.css'
import './Header.css'

/* App header*/
class Header extends React.Component {

  static propTypes = {
    logoutFn: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  toggle(e) {
    var nav = e.target.parentElement.querySelector('#nav')

    if (nav) {
      /* Set it to visible */
      nav.classList.toggle('visible')
      /* Set timer to remove visible */
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        nav.classList.remove('visible')
      }, 5000);
    }
  }

  onClickOut(e) {
    // alert('user clicked outside of the component!');
    var nav = e.document.getElementById('nav')

    if (nav) {
      nav.classList.remove('visible')
    }
  }

  render() {

    return (
      <header className='header'>
        <div className='home-menu pure-menu pure-menu-horizontal title-background' id='menu'>
          <div className='home-menu-brand'>
            <Link className='pure-menu-heading' to='/'>HomeAutomation</Link>
          </div>
          <div className='menu-toggle' onClick={(e) => {this.toggle(e)}}/>
          <nav id='nav'>
            <Menu>
              <Menu.Item to='/cat'>Catalogue</Menu.Item>
            </Menu>
            <Menu className='position-right'>
              <Menu.DropdownItem title='User' className='pure-menu-allow-hover'>
                <Menu.Item onClick={ this.props.logoutFn }>Logout</Menu.Item>
              </Menu.DropdownItem>
            </Menu>

          </nav>
        </div>
      </header>
    )
  }

}

//pure-menu-allow-hover

export default Header
