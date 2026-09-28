import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import {
  useAuth,
} from '../../context/AuthContext'


function ProtectedRoute() {

  const {
    admin,
    loading,
  } = useAuth()


  const location =
    useLocation()


  if (loading) {

    return (

      <div className="admin-auth-loading">

        <div className="admin-auth-loading-mark">
          A
        </div>

        <span>
          Verifying admin session...
        </span>

      </div>

    )

  }


  if (!admin) {

    return (

      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />

    )

  }


  return <Outlet />

}


export default ProtectedRoute