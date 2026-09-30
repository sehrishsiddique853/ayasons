import {
  useEffect,
  useState,
} from 'react'

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from 'lucide-react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  useAuth,
} from '../context/AuthContext'

import '../styles/login.css'


function Login() {

  const {
    admin,
    loading,
    login,
  } = useAuth()


  const navigate =
    useNavigate()


  const location =
    useLocation()


  const [
    email,
    setEmail,
  ] = useState('')


  const [
    password,
    setPassword,
  ] = useState('')


  const [
    showPassword,
    setShowPassword,
  ] = useState(false)


  const [
    submitting,
    setSubmitting,
  ] = useState(false)


  const [
    error,
    setError,
  ] = useState('')


  useEffect(
    () => {

      if (
        !loading &&
        admin
      ) {

        navigate(
          '/',
          {
            replace: true,
          }
        )

      }

    },
    [
      admin,
      loading,
      navigate,
    ]
  )


  const handleSubmit =
    async (
      event
    ) => {

      event.preventDefault()


      if (
        !email.trim() ||
        !password
      ) {

        setError(
          'Enter your email and password.'
        )

        return

      }


      try {

        setSubmitting(true)
        setError('')


        await login(
          email.trim(),
          password
        )


        const destination =
          location.state
            ?.from
            ?.pathname ||
          '/'


        navigate(
          destination,
          {
            replace: true,
          }
        )

      } catch (error) {

        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to sign in. Please check your credentials.'
        )

      } finally {

        setSubmitting(false)

      }

    }


  return (

    <main className="admin-login-page">

      <div className="admin-login-background-mark">
        AYOSONS
      </div>


      <section className="admin-login-card">

        <div className="admin-login-brand">

          <div className="admin-login-logo">
            A
          </div>


          <div>

            <strong>
              AYOSONS
            </strong>

            <span>
              ADMINISTRATION
            </span>

          </div>

        </div>


        <div className="admin-login-heading">

          <span>
            SECURE ACCESS
          </span>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in with your authorised
            administrator account to manage
            the AYOSONS website.
          </p>

        </div>


        {error && (

          <div className="admin-login-error">
            {error}
          </div>

        )}


        <form
          className="admin-login-form"
          onSubmit={
            handleSubmit
          }
        >

          <label>

            <span>
              Email Address
            </span>


            <div className="admin-login-input">

              <Mail
                size={18}
              />


              <input
                type="email"
                value={email}
                onChange={
                  (event) =>
                    setEmail(
                      event.target.value
                    )
                }
                placeholder="user@gmail.com"
                autoComplete="username"
                autoFocus
              />

            </div>

          </label>


          <label>

            <span>
              Password
            </span>


            <div className="admin-login-input">

              <LockKeyhole
                size={18}
              />


              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={
                  password
                }
                onChange={
                  (event) =>
                    setPassword(
                      event.target.value
                    )
                }
                placeholder="Enter password"
                autoComplete="current-password"
              />


              <button
                type="button"
                className="admin-login-password-toggle"
                onClick={
                  () =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >

                {
                  showPassword
                    ? (
                      <EyeOff
                        size={18}
                      />
                    )
                    : (
                      <Eye
                        size={18}
                      />
                    )
                }

              </button>

            </div>

          </label>


          <button
            type="submit"
            className="admin-login-submit"
            disabled={
              submitting
            }
          >

            {
              submitting
                ? 'Signing In...'
                : 'Sign In'
            }

          </button>

        </form>


        <div className="admin-login-security">

          <LockKeyhole
            size={14}
          />

          <span>
            Protected administrator access
          </span>

        </div>

      </section>

    </main>

  )

}


export default Login