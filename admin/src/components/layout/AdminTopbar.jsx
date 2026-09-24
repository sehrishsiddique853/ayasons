import {
  Menu,
} from 'lucide-react'


function AdminTopbar({
  onMenuClick,
}) {
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


      <div className="admin-profile">

        <div className="admin-profile-avatar">
          A
        </div>

        <div className="admin-profile-info">

          <strong>
            Administrator
          </strong>

          <span>
            Admin
          </span>

        </div>

      </div>

    </header>
  )
}


export default AdminTopbar