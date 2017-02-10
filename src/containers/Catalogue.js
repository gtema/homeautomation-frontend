import React, { PropTypes, Component }  from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


import Sidebar from '../basecomponents/Sidebar'
import Spinner from '../basecomponents/Spinner'
import Alert from '../basecomponents/Alert'

import { categoryPropTypes } from '../tools/constants'
// import { categoryPropTypes, cataloguePath } from '../tools/constants'
// import CategoryList from '../components/CategoryList'
import * as UIActionCreators from '../actions/ui'
import * as CatalogueActionCreators from '../actions/categories'
import AddCategoryWidget  from './AddCategory'
import AddProductWidget  from './AddProduct'
import CategoryTreeMenu from '../components/CategoryTreeMenu'

import { makeGetPathToRootFromCategoryId, makeGetCurrentCategory, makeGetVisibleSubcategoriesByCategoryId, getCategoriesTree } from '../selectors/Catalogue'

import './Catalogue.css'

// CatalogueApp
class CatalogueAppImpl extends Component {

  static propTypes = {
    category: categoryPropTypes,
    pathToTop: PropTypes.arrayOf(categoryPropTypes),
    subCategories: PropTypes.arrayOf(categoryPropTypes)
  }

  static defaultProps = {
    category: { id:0, name:'', parent_id:0 },
    pathToTop: [],
    subCategories: [],
    categoryEditId: null,
  }

  constructor(props) {
    super(props)
    this.state={
      alertVisible:true,//(this.props.ui.alertText !== null || this.props.ui.alertText !== "")? false:false,
      subcategoriesVisible:true,
      sidebarOpen: false,
      sidebarDocked: false,
      toggleSwitch: "chevron-left"
    }
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this)
    this.handleAlertShow = this.handleAlertShow.bind(this)
    this.handleAddCategoryMode = this.handleAddCategoryMode.bind(this)
    this.handleSubcategoriesCollapse = this.handleSubcategoriesCollapse.bind(this)
  }

  componentDidMount() {
    this.props.selectCategoryId(this.props.categoryId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categoryId !== this.props.categoryId) {
      this.props.selectCategoryId(nextProps.categoryId);
    }
  }

  handleSubcategoriesCollapse() {
    this.setState({
      subcategoriesVisible : !this.state.subcategoriesVisible,
      toggleSwitch : (this.state.subcategoriesVisible)? "chevron-right":"chevron-left"
    })
  }

  handleAlertDismiss() {
   this.setState({alertVisible: false});
  }

  handleAlertShow() {
   this.setState({alertVisible: true});
  }

  handleAddCategoryMode() {
    this.props.toggleAddCategoryMode();
  }

  handleAddProductMode() {
    this.props.toggleAddProductMode();
  }

  render() {
    const { categoryId, pathToTop, children, categoryEditId, alertText, alertType, fetchingSubcategoriesByCategoryId } = this.props;

    let alert;
    // if (this.state.alertVisible && alertText !== null && alertText !== "" && typeof alertText !== 'undefined') {
      alert = (
        <Alert type={alertType || 'info'}>
          {alertText}
        </Alert>
      )
      // (
          // <Alert bsStyle={ui.alertType} onDismiss={this.handleAlertDismiss}>
          //   <h4>Oh snap! You got an error!</h4>
          //   <p>{alertText}</p>
          // </Alert>
        // )
    // }

    const pathIds = pathToTop
      .map(item=> {return item["id"]}) || [0]

    const sidebarContent = (categoryId === fetchingSubcategoriesByCategoryId)?
        (<Spinner />)
        :
        (this.props.categoriesTree)?
            (<div className="pure-menu custom-restricted-width">
              <CategoryTreeMenu
                tree={this.props.categoriesTree}
                toggleEditFn={this.props.toggleCategoryEditMode}
                modifyFn={this.props.modifyCategory}
                addCategoryFn={this.props.toggleAddCategoryMode}
                editItemId={categoryEditId}
                currentPathIds={pathIds}
              />
            </div>
            )
          : null

    const appHeader = (categoryId === fetchingSubcategoriesByCategoryId)?
        (<Spinner />)
        :
        null

    return (
      <div className="CatalogueApp">
        {alert}
        <AddCategoryWidget />
        <AddProductWidget />
        <Sidebar sidebar={sidebarContent}>
          <div className="container-fluid">
          {appHeader}
          {children}
          </div>
        </Sidebar>

      </div>

    )
  }
}
// <Button componentClass="btn-sm" onClick={() => { this.handleSubcategoriesCollapse() }}><Glyphicon glyph={this.state.toggleSwitch} /></Button>
// Introduce reselect caching per property (categoryId)
const makeMapStateToProps = () => {
  const getVisibleSubcategoriesByCategoryId = makeGetVisibleSubcategoriesByCategoryId()
  const getCurrentCategory = makeGetCurrentCategory()
  const getPathToRootFromCategoryId = makeGetPathToRootFromCategoryId()
  // const getCategoriesTree = getCategoriesTree()

  const mapStateToProps = (state, ownProps) => {
    return {
      categoryId: parseInt(ownProps.params.groupId, 10) || 0,
      category: getCurrentCategory(state, ownProps),
      pathToTop: getPathToRootFromCategoryId(state, ownProps),
      subCategories: getVisibleSubcategoriesByCategoryId(state, ownProps),
      // ui: state.ui.toObject,
      categoryEditId: state.ui.get('categoryEditId'),
      alertText: state.ui.get('alertText'),
      alertType: state.ui.get('alertType'),
      fetchingSubcategoriesByCategoryId: state.ui.get('fetchingSubcategoriesByCategoryId'),
      categoriesTree: getCategoriesTree(state, ownProps),
    }
  }

  return mapStateToProps
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, UIActionCreators, CatalogueActionCreators), dispatch)
}

const CatalogueApp = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(CatalogueAppImpl)

export default CatalogueApp
