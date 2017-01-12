import React from 'react'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
// import { FormGroup, FormControl, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'

import './App.css'

// Overall root app
const App = ( props ) => {

  const navHeader = (
    <Navbar fixedTop fluid className="app-navbar">
      <Navbar.Header>
        <Navbar.Brand><Link to="/">HomeAutomation</Link></Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/cat">
            <NavItem eventKey={1}>Catalogue</NavItem>
          </LinkContainer>
        </Nav>
        <Nav pullRight>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
  // Comment it out, as it leads to error on page
  // <Navbar.Form pullLeft>
  // <FormGroup>
  // <FormControl type="text" placeholder="Search - not implemented yet" />
  // </FormGroup>
  // {' '}
  // <Button type="submit">Submit</Button>
  // </Navbar.Form>

  return (
    <div>
      {navHeader}
      <div className="main-content container-fluid">
        {props.children}
      </div>
    </div>
  )
}

export default App
