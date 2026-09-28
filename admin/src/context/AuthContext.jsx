import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import api from '../services/api'


const AuthContext =
  createContext(null)


export function AuthProvider({
  children,
}) {

  const [
    admin,
    setAdmin,
  ] = useState(null)


  const [
    loading,
    setLoading,
  ] = useState(true)


  const checkAuth =
    async () => {

      try {

        const response =
          await api.get(
            '/admin/auth/me'
          )


        setAdmin(
          response.data.admin
        )

      } catch {

        setAdmin(null)

      } finally {

        setLoading(false)

      }

    }


  useEffect(
    () => {

      checkAuth()


      const handleUnauthorized =
        () => {
          setAdmin(null)
        }


      window.addEventListener(
        'admin:unauthorized',
        handleUnauthorized
      )


      return () => {

        window.removeEventListener(
          'admin:unauthorized',
          handleUnauthorized
        )

      }

    },
    []
  )


  const login =
    async (
      email,
      password
    ) => {

      const response =
        await api.post(
          '/admin/auth/login',
          {
            email,
            password,
          }
        )


      setAdmin(
        response.data.admin
      )


      return response.data.admin

    }


  const logout =
    async () => {

      try {

        await api.post(
          '/admin/auth/logout'
        )

      } finally {

        setAdmin(null)

      }

    }


  return (

    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >

      {children}

    </AuthContext.Provider>

  )

}


export function useAuth() {

  const context =
    useContext(
      AuthContext
    )


  if (!context) {

    throw new Error(
      'useAuth must be used inside AuthProvider.'
    )

  }


  return context

}