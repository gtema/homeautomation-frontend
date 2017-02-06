import React, { PropTypes, Component }  from 'react'
import {ContainerQuery } from 'react-container-query';
import classnames from 'classnames';

//import 'font-awesome/css/font-awesome.min.css'
import 'purecss/build/menus-min.css'
import Icon from './Icon'
import './Sidebar.css'

const query = {
  'sidebarBar-visible': {
    minWidth: 800,
  }
};

class Sidebar extends Component {

  static propTypes = {
    sidebar: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
  }

  render() {
    const { sidebar, children } = this.props;

    return (
      <ContainerQuery query={query}>
        {(params) => (
        <div className="sidebarContainer">
          <nav className={classnames('sidebarBar', params)}>
            {sidebar}
          </nav>
          <span data-spy="affix" data-offset-top="60" className="sidebarToggler fa" onClick={
            (e) => {
              const sidebar = e.target.parentElement.getElementsByClassName("sidebarBar");
              sidebar[0].classList.toggle("sidebarBar-visible");
            }
          }>
          </span>
          <div className="sidebarMain">
            {children}
          </div>

        </div>
        )}
      </ContainerQuery>
    );
  }
}

export default Sidebar
