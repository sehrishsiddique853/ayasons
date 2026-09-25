import { useEffect, useState } from 'react'
import { Mail, Save } from 'lucide-react'

import api from '../services/api'

import '../styles/contact.css'

function Contact() {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    const loadSettings = async () => {
      try {
        const response = await api.get('/admin/contact')
        if (active) {
          setRecipientEmail(response.data.settings?.recipientEmail || '')
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.data?.message ||
            'Unable to load contact settings.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      active = false
    }
  }, [])

  const saveSettings = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/admin/contact', { recipientEmail })
      setRecipientEmail(response.data.settings.recipientEmail)
      setSuccess('Contact email saved successfully.')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        'Unable to save contact settings.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="contact-admin-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">COMMUNICATION</span>
          <h1>Contact</h1>
          <p>Choose where website enquiries should be delivered.</p>
        </div>
      </div>

      {error && <p className="contact-admin-message contact-admin-error">{error}</p>}
      {success && <p className="contact-admin-message contact-admin-success">{success}</p>}

      <form className="contact-admin-card" onSubmit={saveSettings}>
        <div className="contact-admin-card-icon" aria-hidden="true">
          <Mail size={22} />
        </div>
        <div className="contact-admin-card-content">
          <label htmlFor="recipientEmail">Enquiry recipient email</label>
          <p>Every request from the website quote form will be sent to this address through Resend.</p>
          <input
            id="recipientEmail"
            type="email"
            value={recipientEmail}
            onChange={(event) => setRecipientEmail(event.target.value)}
            placeholder="sales@ayosons.com"
            required
            disabled={loading || saving}
          />
          <button type="submit" disabled={loading || saving}>
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Contact Email'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Contact
