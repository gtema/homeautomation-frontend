import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loginUser } from '../actions/auth'
import Login from '../components/Login'
import Header from '../components/Header'

import 'purecss/build/base-min.css'
import './App.css'

class App extends Component {
  render() {
    const { dispatch, isAuthenticated, errorMessage, children } = this.props
    return (isAuthenticated)?
    (
      <div>
        <Header
          isAuthenticated={isAuthenticated}
          errorMessage={errorMessage}
          dispatch={dispatch}
          />
        <div className="main-content container-fluid">
          {children}
        </div>
      </div>
    ) :
    (
      <Login
        errorMessage={errorMessage}
        onLoginClick={ creds => dispatch(loginUser(creds)) }
      />
    )
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  children: PropTypes.object,
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

export default connect(mapStateToProps)(App)
