import {
  LogOut,
  Menu,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  useAuth,
} from '../../context/AuthContext'

import '../../styles/admin-topbar-auth.css'


function AdminTopbar({
  onMenuClick,
}) {

  const {
    admin,
    logout,
  } = useAuth()


  const navigate =
    useNavigate()


  const handleLogout =
    async () => {

      await logout()

      navigate(
        '/login',
        {
          replace: true,
        }
      )

  }


  const adminInitial =
    admin?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    'A'


  return (

    <header className="admin-topbar">

      <div className="admin-topbar-left">

        <button
          className="admin-menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>


        <div>

          <span className="admin-topbar-label">
            AYOSONS
          </span>

          <p>
            Product Management
          </p>

        </div>

      </div>


      <div className="admin-topbar-account">

        <div className="admin-profile">

          <div className="admin-profile-avatar">

            {adminInitial}

          </div>


          <div className="admin-profile-info">

            <strong>
              {
                admin?.name ||
                'Administrator'
              }
            </strong>

            <span>
              {
                admin?.email ||
                'Admin'
              }
            </span>

          </div>

        </div>


        <button
          type="button"
          className="admin-logout-button"
          onClick={
            handleLogout
          }
          title="Logout"
        >

          <LogOut
            size={17}
          />

          <span>
            Logout
          </span>

        </button>

      </div>

    </header>

  )

}


export default AdminTopbar