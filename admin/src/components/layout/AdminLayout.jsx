import {
  useState,
} from 'react'

import {
  Outlet,
} from 'react-router-dom'

import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'


function AdminLayout() {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false)


  const openSidebar = () => {
    setSidebarOpen(true)
  }


  const closeSidebar = () => {
    setSidebarOpen(false)
  }


  return (
    <div className="admin-layout">

      <AdminSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
      />


      {sidebarOpen && (
        <button
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        />
      )}


      <div className="admin-main">

        <AdminTopbar
          onMenuClick={openSidebar}
        />


        <main className="admin-content">

          <Outlet />

        </main>

      </div>

    </div>
  )
}


export default AdminLayout