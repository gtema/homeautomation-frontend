import React from 'react'

import 'font-awesome/css/font-awesome.min.css'

/* Spinner */
const Spinner = ( props ) => {

  return React.createElement(
    'span',
    Object.assign({}, {
      className: "fa fa-spinner",
    })
  )

}

export default Spinner
