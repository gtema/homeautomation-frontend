import React, {PropTypes} from 'react'
import classnames from 'classnames';

import './Modal.css'
import 'purecss/build/buttons-min.css'

var Modal = React.createClass({
  render: function() {
    const className = classnames("pure-button", this.props.className)
    const onClick = (this.props.onClick)? this.props.onClick : null
    const type = this.props.type || "button"
    const title = this.props.title || null
    return (
      <div id="myModal" class="modal">

        <div class="modal-content">
          <span class="close">&times;</span>
          <p>Some text in the Modal..</p>
        </div>

      </div>
    );
  }
});

export default Modal
