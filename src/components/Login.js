// components/Login.js
import React, { Component, PropTypes } from 'react'

import 'purecss/build/forms-min.css'
import './Login.css'

import Button from './Button'

export default class Login extends Component {

  render() {
    const { errorMessage } = this.props

    return (
      <div className="login-form">
        <form className="pure-form pure-form-aligned">
          <fieldset>
            <div className="pure-control-group">
                <label htmlFor="name">Username</label>
                <input type='text' ref='username' className="form-control" placeholder='Username'/>
            </div>

            <div className="pure-control-group">
                <label htmlFor="password">Password</label>
                <input type='password' ref='password' className="form-control" placeholder='Password'/>
            </div>

            <div className="pure-control-group">
              <label />
              <Button onClick={(event) => {this.handleClick(event); }} className="pure-button-primary">
                Login
              </Button>
              {errorMessage &&
                <span className="pure-form-message">{errorMessage}</span>
              }
            </div>

          </fieldset>
        </form>

      </div>
    )
  }

  handleClick(event) {
    const username = this.refs.username
    const password = this.refs.password
    const creds = { username: username.value.trim(), password: password.value.trim() }
    event.preventDefault();
    this.props.onLoginClick(creds)
  }
}

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
}
