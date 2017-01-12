import { connect } from 'react-redux'
import React, { PropTypes, Component }  from 'react'
import { Alert, ButtonGroup, Button, Glyphicon, Col, Collapse, Navbar, Nav, NavItem, FormGroup, FormControl, Clearfix } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
// import Sidebar from 'react-sidebar'
// import {TreeMenu, TreeNode} from 'react-tree-menu'

import { categoryPropTypes, cataloguePath } from '../tools/constants'
import CategoryList from '../components/CategoryList'
import * as UIActionCreators from '../actions/ui'
import * as CatalogueActionCreators from '../actions/categories'
import AddCategoryWidget  from './AddCategory'
import AddProductWidget  from './AddProduct'
import Spinner from '../components/Spinner'
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
    const { categoryId, pathToTop, subCategories, ui, children, categoryEditId, alertText, fetchingSubcategoriesByCategoryId } = this.props;

    let alert;
    if (this.state.alertVisible && alertText !== null && alertText !== "" && typeof alertText !== 'undefined') {
      alert = (
          <Alert bsStyle={ui.alertType} onDismiss={this.handleAlertDismiss}>
            <h4>Oh snap! You got an error!</h4>
            <p>{alertText}</p>
          </Alert>
        )
    }
    const subcategoriesSidebarPresent = (subCategories.length > 0 && this.state.subcategoriesVisible)? true: false;

    const sidebarContent = (categoryId === fetchingSubcategoriesByCategoryId)?
        (<Spinner />)
        :
        // (
        //   <CategoryList
        //     elements={subCategories}
        //     toggleEditFn={this.props.toggleCategoryEditMode}
        //     modifyFn={this.props.modifyCategory}
        //     editItemId={categoryEditId}
        //   />
        // )
        (this.props.categoriesTree)?
            (<CategoryTreeMenu
              tree={this.props.categoriesTree}
              toggleEditFn={this.props.toggleCategoryEditMode}
              modifyFn={this.props.modifyCategory}
              editItemId={categoryEditId}
            />)
          : null



    const appHeader = (categoryId === fetchingSubcategoriesByCategoryId)?
        (<Spinner />)
        :
        (
      <div className="catalogueHeader">
        <Navbar fluid>
          <Nav>
            { pathToTop &&
              pathToTop.map(cat =>
                <LinkContainer key={cat.id} to={{pathname: cataloguePath + '/' + cat.id}}>
                <NavItem eventKey={cat.id} title={cat.name}>
                {cat.name}
                </NavItem>
                </LinkContainer>
              )
            }
            <NavItem eventKey={1} onClick={() => { this.handleAddCategoryMode() }} title="Add New Subcategory"><Button componentClass="btn-sm"><Glyphicon glyph="plus" /></Button></NavItem>
          </Nav>
          <Nav pullRight activeKey={0} bsStyle="pills">
            <NavItem eventKey={2} onClick={() => { this.props.toggleAddProductMode() }} title="Add Product"><Button componentClass="btn-sm"><Glyphicon glyph="plus-sign" /></Button></NavItem>
          </Nav>
          <Navbar.Form pullRight>
            <FormGroup>
              <FormControl type="text" placeholder="Filter" onChange={(e) => console.log("Filter value" + e.target.value)}/>
            </FormGroup>
            {' '}
            <Button type="submit" componentClass="btn-sm"><Glyphicon glyph="search" /></Button>
          </Navbar.Form>
        </Navbar>
      </div>
    )
    // <NavItem eventKey={3} onClick={() => { this.handleSubcategoriesCollapse() }}><Glyphicon glyph="th-list" /></NavItem>

    return (
      <div className="CatalogueApp">
        {alert}
        <AddCategoryWidget />
        <AddProductWidget />
        {appHeader}
        <div className="row">
          <div className="CatSidebar">
            {sidebarContent}
          </div>
          <div className="CatContent">
            {children}
          </div>
        </div>

      </div>

    )
    // <span className="SidebarToggler"><Glyphicon glyph={this.state.toggleSwitch} /></span>
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
      ui: state.ui.toObject,
      categoryEditId: state.ui.get('categoryEditId'),
      alertText: state.ui.get('alertText'),
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
