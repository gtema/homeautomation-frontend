import React  from 'react'
import {ContainerQuery } from 'react-container-query';
import classnames from 'classnames';

import './Sidebar.css'

const query = {
  'sidebarBar-visible': {
    minWidth: 800,
  }
};

const SIDEBAR_MIN_WIDTH = 300

class Sidebar extends React.Component {

  static propTypes = {
    sidebar: React.PropTypes.object.isRequired,
    children: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      'sidebarVisibleMinWidth': SIDEBAR_MIN_WIDTH,
    }

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }

  onTouchStart(event) {
    console.log("touchStart")
    //get sidebar
    const sidebar = document.getElementById('sidebarBar')
    //get computedStyle
    const computedStyle = window.getComputedStyle(sidebar, null);
    //set start pos and original width
    this.setState({'touchX': event.touches[0].pageX, 'sidebarCurrentWidth': parseInt(computedStyle.minWidth, 10) || 0})
  }

  onTouchEnd(event) {
    const sidebar = document.getElementById('sidebarBar')
    if (sidebar.classList.contains('sidebarBar-visible')) {
      // Currently should be visible
      if (this.state.sidebarCurrentWidth < this.state.sidebarVisibleMinWidth / 2) {
        //collapse
        this.toggleSidebar(event)
      }
    } else {
      if (this.state.sidebarCurrentWidth > this.state.sidebarVisibleMinWidth / 2) {
        //collapse
        this.toggleSidebar(event)
      }

    }
    // reset minWidth to be of the CSS
    sidebar.style.minWidth = null
  }

  onTouchMove(event) {
    // Calculate move
    const diff = this.state.touchX - event.touches[0].pageX
    //save new touch position
    this.setState({'touchX': event.touches[0].pageX})
    //get sidebar
    const sidebar = document.getElementById('sidebarBar')
    //get computedStyle
    const computedStyle = window.getComputedStyle(sidebar, null);
    //calculate new width
    const newWidth = (parseInt(computedStyle.minWidth, 10) || 0) - diff
    if (newWidth <= this.state.sidebarVisibleMinWidth) {
      //resize
      sidebar.style.minWidth = newWidth + 'px'
      //save new position
      this.setState({'sidebarCurrentWidth': newWidth})
    }
  }

  toggleSidebar(event) {
    const sidebar = document.getElementById('sidebarBar')
    if (sidebar) {
        sidebar.classList.toggle('sidebarBar-visible')
    } else {
      console.error('Cannot find sidebar')
    }
  }

  render() {
    const { sidebar, children } = this.props;

    return (
      <ContainerQuery query={query}>
        {(params) => (
        <div className='sidebarContainer'>
          <nav id='sidebarBar' className={classnames('sidebarBar', params)} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onTouchMove={this.onTouchMove}>
            {sidebar}
          </nav>
          <div className='sidebarToggler fa' onClick={this.toggleSidebar} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onTouchMove={this.onTouchMove}/>
          <div className='sidebarMain'>
            {children}
          </div>

        </div>
        )}
      </ContainerQuery>
    );
  }
}

export default Sidebar
