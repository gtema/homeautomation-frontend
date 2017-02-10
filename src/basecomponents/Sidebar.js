import React  from 'react'
import {ContainerQuery } from 'react-container-query';
import classnames from 'classnames';

import './Sidebar.css'

const query = {
  'sidebarBar-visible': {
    minWidth: 800,
  }
};

class Sidebar extends React.Component {

  static propTypes = {
    sidebar: React.PropTypes.object.isRequired,
    children: React.PropTypes.object.isRequired,
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
