import React, {PropTypes} from 'react'
import classnames from 'classnames';

// import './Button.css'
import 'purecss/build/buttons-min.css'

var ButtonGroup = React.createClass({
  render: function() {
    return (
      <div className="pure-button-group" role="group" aria-label="Buttons...">
          {this.props.children}
      </div>
    );
  }
});

export default ButtonGroup
