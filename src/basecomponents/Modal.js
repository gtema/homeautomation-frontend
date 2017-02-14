import React, { Component } from 'react'

import './Modal.css'

/* Modal ModalHeader */
class ModalHeader extends Component {

  // static propTypes = {
  //   children: React.PropTypes.object
  // }
  //
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

ModalHeader.contextTypes = {
  onClose: React.PropTypes.func,
}

/* Modal ModalBody */
class ModalBody extends Component {
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

/* Modal ModalFooter */
class ModalFooter extends Component {
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

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal
