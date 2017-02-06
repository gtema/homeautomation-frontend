import React, { PropTypes, Component }  from 'react'
import classnames from 'classnames';

import 'font-awesome/css/font-awesome.min.css'

var Icon = React.createClass({
  render: function() {
    const classNames = classnames("fa", this.props.icon)
    const onClick = (this.props.onClick)? this.props.onClick : null
    return (
      <i
        className={classNames}
        onClick={onClick}
        aria-hidden={true}
        />
    );
  }
});

export default Icon
