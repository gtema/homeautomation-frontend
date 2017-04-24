/* containers/AppSearch.js */
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'

import 'purecss/build/forms-min.css'
import './AppSearch.css'

import Icon from '../basecomponents/Icon'

import * as UIActionCreators from '../actions/ui'
import * as CategoriesActionCreators from '../actions/categories'
import * as ProductActionCreators from '../actions/products'
import * as ProductItemsActionCreators from '../actions/productItems'

import {getCatalogueSearchResults} from '../selectors/Catalogue'

import { cataloguePath } from '../tools/constants'

// App Search
class AppSearchImpl extends React.Component {

  static propTypes = {
    searchResults: PropTypes.arrayOf(PropTypes.shape({
      'id': PropTypes.number.isRequired,
      'name': PropTypes.string.isRequired
    }))
  }

  static contextTypes = {
    router: PropTypes.object
  }

  // constructor(props) {
  //   super(props)
  //
  // }

  render() {

    const searchItem = (item) => {
      let link = null
      let key = `${item.type}${item.id}`

      switch(item.type) {
        case 'C':
          link = `${cataloguePath}/${item.id}`
          break
        case 'P':
          link = `${cataloguePath}/${item.category_id}/item/${item.id}`
          break
        default:
          // do nothing
      }

      if (link !== null) {
        return (
          <li key={key}>
            <Link className='pure-menu-link' to={link}>
              <span className='entry-type'>
                {item.type}
              </span>
              {item.name}
            </Link>
          </li>
        )
      }

    }

    return (
      <form className="app-search pure-form">
        <div className="inline-container pure-control-group">
          <Icon icon='icon fa-search'/>
          <input type='search' className='inline-results' name='search' placeholder='Search' onChange={(e) => this.props.search(e.target.value)}/>
          {this.props.searchResults &&
            <ul className='search-results'>
              {this.props.searchResults.map(searchItem)}
            </ul>
          }
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    searchResults: getCatalogueSearchResults(state)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
      Object.assign({},
        UIActionCreators, CategoriesActionCreators, ProductActionCreators, ProductItemsActionCreators),
      dispatch)
}

const AppSearch = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppSearchImpl)

export default AppSearch
