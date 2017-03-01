/* containers/AppSearch.js */
import React from 'react'
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
    searchResults: React.PropTypes.arrayOf(React.PropTypes.shape({
      'id': React.PropTypes.number.isRequired,
      'name': React.PropTypes.string.isRequired
    }))
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  // constructor(props) {
  //   super(props)
  //
  // }

  render() {

    const searchItem = (item) => {
      return (
        <li key={item.id}>
          <Link className='pure-menu-link' to={`${cataloguePath}/${item.id}`}>
            <span className='entry-type'>
              {item.type}
            </span>
            {item.name}
          </Link>
        </li>
      )
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
