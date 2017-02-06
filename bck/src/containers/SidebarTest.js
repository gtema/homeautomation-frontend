import React, { Component }  from 'react'

import Sidebar from '../components/Sidebar';

class SidebarTest extends Component {

  render() {

    const sidebarContent = <b>Sidebar content</b>;
    const mainContent = <b>main content</b>;

    return (
      <div>
        <Sidebar
          sidebar={sidebarContent}
          main={mainContent} >
            <b>something</b>
        </Sidebar>
      </div>
    );
  }
}

export default SidebarTest
