import React  from 'react'
import PropTypes from 'prop-types'
import {ContainerQuery } from 'react-container-query'
import classnames from 'classnames'

import './Sidebar.css'

// Break point for the sidebar to be visible by default
const query = {
  'sidebarBar-visible': {
    minWidth: 800,
  }
}

const SIDEBAR_MIN_WIDTH = 300
const CANCEL_DISTANCE_ON_SCROLL = 20

const SIDEBAR_MODE = {
  LISTEN: {value: 1},
  MOVE: {value: 2},
  IGNORE: {value: 0}
}

class Sidebar extends React.Component {

  static propTypes = {
    sidebar: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    'touch': true
  }

  constructor(props) {
    super(props)

    this.state = {
      'sidebarVisibleMinWidth': SIDEBAR_MIN_WIDTH,
      'sidebarWidth': SIDEBAR_MIN_WIDTH,
      // keep track of touching params
      'touchIdentifier': null,
      'touchStartX': null,
      'touchStartY': null,
      'touchCurrentX': null,
      'touchCurrentY': null,

      'dragSupported': false,
    }

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.saveSidebarRef = this.saveSidebarRef.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }

  componentDidMount() {
    this.setState({
      'dragSupported': typeof window === 'object' && 'ontouchstart' in window,
    })
    // this.saveSidebarWidth()
  }


  onTouchStart(event) {
    // filter out if a user starts swiping with a second finger
    if (!this.isTouching()) {
      const touch = event.targetTouches[0]

      //get sidebar
      const sidebar = this.sidebar
      // //get computedStyle
      const computedStyle = window.getComputedStyle(sidebar, null)
      //set start pos and original width
      this.setState({
        'touchIdentifier': touch.identifier,
        'touchStartX': touch.clientX,
        'touchStartY': touch.clientY,
        'touchCurrentX': touch.clientX,
        'touchCurrentY': touch.clientY,
        'sidebarMode': SIDEBAR_MODE.LISTEN,
        'sidebarCurrentWidth': parseInt(computedStyle.minWidth, 10) || 0
      })
    }
  }

  onTouchEnd(event) {

    if (this.isTouching()) {
      // trigger a change to open if sidebar has been dragged beyond half size

      this.setState({
        'touchIdentifier': null,
        'touchStartX': null,
        'touchStartY': null,
        'touchCurrentX': null,
        'touchCurrentY': null,
        'sidebarMode': SIDEBAR_MODE.IGNORE
      })

      const touchWidth = this.touchSidebarWidth()

      // // Are we in the move mode?
      if (this.state.sidebarMode === SIDEBAR_MODE.MOVE) {
        console.log(touchWidth)
        const sidebar = this.sidebar
        if (sidebar.classList.contains('sidebarBar-visible')) {
          // Currently should be visible
          if (touchWidth < this.state.sidebarVisibleMinWidth / 2) {
            //collapse
            this.toggleSidebar(event)
          }
        } else {
          if (touchWidth > this.state.sidebarVisibleMinWidth / 2) {
            //collapse
            this.toggleSidebar(event)
          }

        }
        // reset minWidth to be of the CSS
        sidebar.style.minWidth = null
        this.setState({'sidebarMode': SIDEBAR_MODE.IGNORE})
        this.sidebar.style.transition = null
        this.sidebar.style.transform = null
      }
    }
  }

  onTouchMove(event) {

    if (this.isTouching()) {
      for (let ind = 0; ind < event.targetTouches.length; ind++) {
        // we only care about the finger that we are tracking
        if (event.targetTouches[ind].identifier === this.state.touchIdentifier) {
          this.setState({
            'touchCurrentX': event.targetTouches[ind].clientX,
            'touchCurrentY': event.targetTouches[ind].clientY,
          })
          break
        }
      }

      // Are we in the listen mode?
      if (this.state.sidebarMode === SIDEBAR_MODE.LISTEN) {
        // Calculate move
        const diffX = this.state.touchStartX - this.state.touchCurrentX
        const diffY = this.state.touchStartY - this.state.touchCurrentY

        const absDiffX = Math.abs(diffX)
        const absDiffY = Math.abs(diffY)

        // Have we passed the listen state and ready for move?
        if (absDiffX > 20 && absDiffX > absDiffY) {
          this.setState({
            'sidebarMode': SIDEBAR_MODE.MOVE,
          })
        } else if (( absDiffX > 20 || absDiffY > 20 ) && absDiffX < absDiffY ) {
          // Do not listen anymore, since movement is in the wrong direction
          this.setState({
            'sidebarMode': SIDEBAR_MODE.IGNORE
          })
        }
      }
    }

    if (this.state.sidebarMode === SIDEBAR_MODE.MOVE) {
      // Calculate move
      const percentage = this.touchSidebarWidth() / this.state.sidebarWidth

      // Move
      if (this.state.sidebarMode === SIDEBAR_MODE.MOVE) {
        // disable transitions and set transform
        this.sidebar.style.transition = 'none'
        this.sidebar.style.transform = `translateX(-${(1 - percentage) * 100}%)`
      }
    }
  }

  // This logic helps us prevents the user from sliding the sidebar horizontally
  // while scrolling the sidebar vertically. When a scroll event comes in, we're
  // cancelling the ongoing gesture if it did not move horizontally much.
  onScroll() {
    if (this.isTouching() && this.inCancelDistanceOnScroll()) {
      this.setState({
        'touchIdentifier': null,
        'touchStartX': null,
        'touchStartY': null,
        'touchCurrentX': null,
        'touchCurrentY': null,
      })
    }
  }

  // True if the on going gesture X distance is less than the cancel distance
  inCancelDistanceOnScroll() {
    return Math.abs(this.state.touchStartX - this.state.touchCurrentX) <
                                        CANCEL_DISTANCE_ON_SCROLL
  }

  isTouching() {
    return this.state.touchIdentifier !== null
  }

  toggleSidebar(event) {
    console.log("toggle")
    const sidebar = document.getElementById('sidebarBar')
    if (sidebar) {
        sidebar.classList.toggle('sidebarBar-visible')
    } else {
      console.error('Cannot find sidebar')
    }
  }

  saveSidebarRef(node) {
    this.sidebar = node
  }

  // calculate the sidebarWidth based on current touch info
  touchSidebarWidth() {
    // if the sidebar is open and start point of drag is inside the sidebar
    // we will only drag the distance they moved their finger
    // otherwise we will move the sidebar to be below the finger.
    if (this.state.touchStartX < this.state.sidebarWidth) {
      if (this.state.touchCurrentX > this.state.touchStartX) {
        return this.state.sidebarWidth
      }
      return this.state.sidebarWidth - this.state.touchStartX + this.state.touchCurrentX
    }
    return Math.min(this.state.touchCurrentX, this.state.sidebarWidth)
  }

  render() {
    const eventHandlers = (this.state.dragSupported)?
    {
      onTouchStart: this.onTouchStart,
      onTouchMove: this.onTouchMove,
      onTouchEnd: this.onTouchEnd,
      onTouchCancel: this.onTouchEnd,
      onScroll: this.onScroll
    } : {}

    return (
      <ContainerQuery query={query}>
        {(params) => (
        <div className='sidebarContainer' >
          <nav id='sidebarBar' className={classnames('sidebarBar', params)} {...eventHandlers} ref={this.saveSidebarRef}>
            {this.props.sidebar}
          </nav>
          <div className='sidebarToggler fa' {...eventHandlers} onClick={this.toggleSidebar}/>
          <div className='sidebarMain'>
            {this.props.children}
          </div>

        </div>
        )}
      </ContainerQuery>
    )
  }
}

export default Sidebar
