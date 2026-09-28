import {
  useEffect,
  useState,
} from 'react'

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Save,
  UserRound,
} from 'lucide-react'

import api
  from '../services/api'

import {
  useAuth,
} from '../context/AuthContext'

import '../styles/settings.css'


function Settings() {

  const {
    admin,
    checkAuth,
  } = useAuth()


  const [
    name,
    setName,
  ] = useState('')


  const [
    currentPassword,
    setCurrentPassword,
  ] = useState('')


  const [
    newPassword,
    setNewPassword,
  ] = useState('')


  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('')


  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false)


  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false)


  const [
    savingProfile,
    setSavingProfile,
  ] = useState(false)


  const [
    savingPassword,
    setSavingPassword,
  ] = useState(false)


  const [
    profileSuccess,
    setProfileSuccess,
  ] = useState('')


  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState('')


  const [
    error,
    setError,
  ] = useState('')


  useEffect(
    () => {

      setName(
        admin?.name ||
        ''
      )

    },
    [
      admin,
    ]
  )


  const saveProfile =
    async (
      event
    ) => {

      event.preventDefault()


      try {

        setSavingProfile(true)

        setError('')
        setProfileSuccess('')
        setPasswordSuccess('')


        await api.put(
          '/admin/auth/profile',
          {
            name,
          }
        )


        await checkAuth()


        setProfileSuccess(
          'Administrator name updated successfully.'
        )

      } catch (error) {

        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to update administrator profile.'
        )

      } finally {

        setSavingProfile(false)

      }

    }


  const savePassword =
    async (
      event
    ) => {

      event.preventDefault()


      setError('')
      setPasswordSuccess('')
      setProfileSuccess('')


      if (
        newPassword !==
        confirmPassword
      ) {

        setError(
          'New password and confirmation do not match.'
        )

        return

      }


      if (
        newPassword.length < 8
      ) {

        setError(
          'New password must contain at least 8 characters.'
        )

        return

      }


      try {

        setSavingPassword(true)


        await api.put(
          '/admin/auth/password',
          {
            currentPassword,
            newPassword,
          }
        )


        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')


        setPasswordSuccess(
          'Password changed successfully.'
        )

      } catch (error) {

        setError(
          error.response
            ?.data
            ?.message ||
          'Unable to change password.'
        )

      } finally {

        setSavingPassword(false)

      }

    }


  return (

    <div className="settings-page">

      <div className="admin-page-header">

        <div>

          <span className="admin-page-eyebrow">
            ACCOUNT
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Manage administrator account
            information and security.
          </p>

        </div>

      </div>


      {error && (

        <div className="settings-message settings-message--error">
          {error}
        </div>

      )}


      <div className="settings-grid">

        {/* PROFILE */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <UserRound size={20} />
            </div>


            <div>

              <h2>
                Administrator Profile
              </h2>

              <p>
                Manage the administrator
                name shown in the control
                panel.
              </p>

            </div>

          </div>


          {profileSuccess && (

            <div className="settings-message settings-message--success">
              {profileSuccess}
            </div>

          )}


          <form
            className="settings-form"
            onSubmit={
              saveProfile
            }
          >

            <label>

              <span>
                Administrator Name
              </span>

              <input
                type="text"
                value={name}
                onChange={
                  (event) =>
                    setName(
                      event.target.value
                    )
                }
                required
              />

            </label>


            <label>

              <span>
                Email Address
              </span>

              <input
                type="email"
                value={
                  admin?.email ||
                  ''
                }
                readOnly
                className="settings-readonly"
              />

              <small>
                The login email is read-only.
              </small>

            </label>


            <button
              type="submit"
              className="settings-save-button"
              disabled={
                savingProfile
              }
            >

              <Save size={16} />

              {
                savingProfile
                  ? 'Saving...'
                  : 'Save Profile'
              }

            </button>

          </form>

        </section>


        {/* PASSWORD */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">
              <LockKeyhole size={20} />
            </div>


            <div>

              <h2>
                Change Password
              </h2>

              <p>
                Confirm your current
                password before creating
                a new one.
              </p>

            </div>

          </div>


          {passwordSuccess && (

            <div className="settings-message settings-message--success">
              {passwordSuccess}
            </div>

          )}


          <form
            className="settings-form"
            onSubmit={
              savePassword
            }
          >

            <label>

              <span>
                Current Password
              </span>


              <div className="settings-password-field">

                <input
                  type={
                    showCurrentPassword
                      ? 'text'
                      : 'password'
                  }
                  value={
                    currentPassword
                  }
                  onChange={
                    (event) =>
                      setCurrentPassword(
                        event.target.value
                      )
                  }
                  autoComplete="current-password"
                  required
                />


                <button
                  type="button"
                  onClick={
                    () =>
                      setShowCurrentPassword(
                        (current) =>
                          !current
                      )
                  }
                  aria-label="Toggle current password visibility"
                >

                  {
                    showCurrentPassword
                      ? <EyeOff size={17} />
                      : <Eye size={17} />
                  }

                </button>

              </div>

            </label>


            <label>

              <span>
                New Password
              </span>


              <div className="settings-password-field">

                <input
                  type={
                    showNewPassword
                      ? 'text'
                      : 'password'
                  }
                  value={
                    newPassword
                  }
                  onChange={
                    (event) =>
                      setNewPassword(
                        event.target.value
                      )
                  }
                  autoComplete="new-password"
                  required
                />


                <button
                  type="button"
                  onClick={
                    () =>
                      setShowNewPassword(
                        (current) =>
                          !current
                      )
                  }
                  aria-label="Toggle new password visibility"
                >

                  {
                    showNewPassword
                      ? <EyeOff size={17} />
                      : <Eye size={17} />
                  }

                </button>

              </div>


              <small>
                Minimum 8 characters.
              </small>

            </label>


            <label>

              <span>
                Confirm New Password
              </span>

              <input
                type="password"
                value={
                  confirmPassword
                }
                onChange={
                  (event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                }
                autoComplete="new-password"
                required
              />

            </label>


            <button
              type="submit"
              className="settings-save-button"
              disabled={
                savingPassword
              }
            >

              <LockKeyhole size={16} />

              {
                savingPassword
                  ? 'Updating...'
                  : 'Change Password'
              }

            </button>

          </form>

        </section>

      </div>

    </div>

  )

}


export default Settings