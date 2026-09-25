import {
  NavLink,
} from 'react-router-dom'

import {
  LayoutDashboard,
  Layers3,
  Package,
  Flame,
  Home,
  Workflow,
  Factory,
  Mail,
  Settings,
  X,
} from 'lucide-react'


const navigation = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },

  {
    label: 'Categories',
    path: '/categories',
    icon: Layers3,
  },

  {
    label: 'Products',
    path: '/products',
    icon: Package,
  },

  {
    label: 'Hot Selling',
    path: '/hot-selling',
    icon: Flame,
  },

  {
    label: 'Home Content',
    path: '/home-content',
    icon: Home,
  },

  {
  label: 'Our Process',
  path: '/our-process',
  icon: Workflow,
},

{
  label: 'Departments',
  path: '/departments',
  icon: Factory,
},
  {
    label: 'Contact',
    path: '/contact',
    icon: Mail,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
]

function AdminSidebar({
  open,
  onClose,
}) {

  return (
    <aside
      className={`
        admin-sidebar
        ${open ? 'admin-sidebar--open' : ''}
      `}
    >

      <div className="admin-sidebar-header">

        <div className="admin-brand">

          <div className="admin-brand-mark">
            A
          </div>

          <div>
            <h2>AYOSONS</h2>
            <span>ADMIN PANEL</span>
          </div>

        </div>


        <button
          className="admin-sidebar-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

      </div>


      <nav className="admin-navigation">

        {navigation.map(
          ({
            label,
            path,
            icon: Icon,
          }) => (

            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({
                isActive,
              }) =>
                `admin-nav-link ${
                  isActive
                    ? 'admin-nav-link--active'
                    : ''
                }`
              }
            >

              <Icon
                size={20}
                strokeWidth={1.8}
              />

              <span>
                {label}
              </span>

            </NavLink>

          )
        )}

      </nav>


      <div className="admin-sidebar-footer">

        <span>
          AYOSONS
        </span>

        <small>
          Management System
        </small>

      </div>

    </aside>
  )
}


export default AdminSidebar