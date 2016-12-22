import React from 'react'
import { Route } from 'react-router'

import { cataloguePath } from './tools/constants'
import App from './components/App'
import CatalogueApp from './containers/Catalogue'
import ProductsApp from './containers/Products'
import Product from './containers/Product'
// import AddCategory  from './components/AddCategory'

export default (
  <Route path="/" component={App} >
    <Route path={cataloguePath} component={CatalogueApp} >
      <Route path=":groupId" component={ProductsApp} />
      <Route path=":groupId/item/:itemId" component={Product} />
    </Route>
  </Route>
)
// <Route path={cataloguePath + "/:groupId/add"} component={AddCategory} />
