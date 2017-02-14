// components/Login.js
import React from 'react'

import Button from '../basecomponents/Button'

import 'purecss/build/forms-min.css'
import './Login.css'


class Login extends React.Component {

  static propTypes = {
    onLoginClick: React.PropTypes.func.isRequired,
    errorMessage: React.PropTypes.string
  }

  handleSubmit(event) {
    const username = this.refs.username
    const password = this.refs.password
    const creds = { username: username.value.trim(), password: password.value.trim() }
    event.preventDefault();
    this.props.onLoginClick(creds)
  }

  render() {
    const { errorMessage } = this.props

    return (
      <div className="login-form">
        <form onSubmit={(e) => {this.handleSubmit(e)}} className="pure-form pure-form-aligned">
          <fieldset>
            <legend>
              Log in
            </legend>
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
              <Button type="submit" className="pure-button-primary">
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
}

export default Login
