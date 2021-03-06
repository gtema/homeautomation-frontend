/* /src/tools/constants.js */
import PropTypes from 'prop-types'
export const cataloguePath = "/cat"


export const API_HOST = process.env.REACT_APP_API_HOST || 'localhost:5000'
export const API_PROTOCOL = (process.env.REACT_APP_API_HTTPS || false)? 'https':'http'
export const API_HTTPS = process.env.REACT_APP_API_HTTPS || false
export const API_PATH = process.env.REACT_APP_API_PATH || '/api/v0/stock/'
export const API_AUTH_PATH = process.env.REACT_APP_API_AUTH_PATH || '/auth'

// Standard category properties
export const categoryPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  parent_id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  prio: PropTypes.number,
  img: PropTypes.string
})

// Standard product properties
export const productPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  category_id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  img: PropTypes.string,
  volume: PropTypes.string,
  amount: PropTypes.number,
  sum_amounts: PropTypes.bool,
  first_started_id: PropTypes.number,
  first_started_ed: PropTypes.date
})

// Standard product properties
export const productItemsPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  product_id: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  is_started: PropTypes.bool.isRequired,
  is_disposed: PropTypes.bool.isRequired,
  is_valid: PropTypes.bool,
  create_date: PropTypes.string.isRequired,
  expiry_date: PropTypes.string.isRequired
})
