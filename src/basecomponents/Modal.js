import React, { Component } from 'react'

import './Modal.css'

/* Modal Header */
class Header extends Component {

  static propTypes = {
    children: React.PropTypes.object
  }

  render() {
    return React.createElement(
      'div',
      Object.assign({}, {
        className: "modal-header",
      }),
      React.createElement(
        'span',
        { 'aria-hidden': 'true', className: 'modal-close', onClick: this.context.onClose },
        '\xD7'
      ),
      this.props.children
    )
  }
}

Header.contextTypes = {
  onClose: React.PropTypes.func,
}

/* Modal Body */
class Body extends Component {
  render() {
    return React.createElement(
      'div',
      Object.assign({}, {
        className: "modal-body",
      }),
      this.props.children
    )
  }
}

/* Modal Footer */
class Footer extends Component {
  render() {
    return React.createElement(
      'div',
      Object.assign({}, {
        className: "modal-footer",
      }),
      this.props.children
    )
  }
}

/* Modal window */
class Modal extends Component {

  static propTypes = {
    isVisible: React.PropTypes.bool,
    onClose: React.PropTypes.func,
  }

  static defaultProps = {
    isVisible: false,
    onClose: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      style: {
        display: (props.isVisible)? "flex":"none"
      }
    }

    this.hide = this.hide.bind(this)
  }

  /* Propagate onClose function through the context to the "close" button in the header*/
  getChildContext() {
    return {
      onClose: this.hide,
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isVisible) {
      this.setState({
        style: {
          display: "flex",
        }
      })
    } else {
      this.setState({
        style: {
          display: "none",
        }
      })
    }
  }

  hide() {
    this.setState({
      style: {
        display: "none",
      }
    })
    if (typeof this.props.onClose !== 'undefined') {
      this.props.onClose()
    }
  }

  render() {
    return (
      <div className="modal" style={this.state.style} role="dialog">
        <div className="modal-content">
          {this.props.children}
        </div>

      </div>
    );
  }
}

Modal.childContextTypes ={
  onClose: React.PropTypes.func,
}

Modal.Header = Header
Modal.Body = Body
Modal.Footer = Footer

export default Modal
