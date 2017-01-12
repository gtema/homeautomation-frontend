import { PropTypes } from 'react'

export const cataloguePath = "/cat"

export const apiPrefix = process.env.REACT_APP_API_PREFIX || "http://localhost:5002/api/v0/stock/";

export const apiRoot = apiPrefix;

export const apiKey = "api_key=23"

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
  create_date: PropTypes.string.isRequired,
  expiry_date: PropTypes.string.isRequired
})
