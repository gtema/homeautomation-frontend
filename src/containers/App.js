/* containers/App.js */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as AuthActionCreators from '../actions/auth'
import Login from '../components/Login'
import Header from '../components/Header'

import 'purecss/build/base-min.css'
import './App.css'

class App extends Component {

  static propTypes = {
    // dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    children: PropTypes.object,
  }

  render() {
    const { isAuthenticated, errorMessage, children } = this.props
    return (isAuthenticated)?
    (
      <div>
        <Header
          isAuthenticated={isAuthenticated}
          errorMessage={errorMessage}
          logoutFn={this.props.logoutUser}
        />
        <div className="main-content">
          {children}
        </div>
      </div>
    ) :
    (
      <Login
        errorMessage={errorMessage}
        onLoginClick={ creds => this.props.loginUser(creds) }
      />
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AuthActionCreators), dispatch)
}

// These props come from the application's
// state when it is started
function mapStateToProps(state) {

  const { auth } = state
  const { isAuthenticated, errorMessage } = auth

  return {
    isAuthenticated,
    errorMessage
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
