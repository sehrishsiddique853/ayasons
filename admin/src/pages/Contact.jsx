import { useEffect, useState } from 'react'
import { Mail, Save } from 'lucide-react'

import api from '../services/api'

import '../styles/contact.css'

const EMPTY_SETTINGS = {
  recipientEmail: '',
  email: '',
  phone: '',
  whatsapp: '',
  linkedin: '',
  instagram: '',
  facebook: '',
}

const PUBLIC_FIELDS = [
  { name: 'email', label: 'Public email', type: 'email', placeholder: 'info@ayosons.com' },
  { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+92 300 1234567' },
  { name: 'whatsapp', label: 'WhatsApp number', type: 'tel', placeholder: '+92 300 1234567' },
  { name: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/company/ayosons' },
  { name: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/ayosons' },
  { name: 'facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/ayosons' },
]

function Contact() {
  const [settings, setSettings] = useState(EMPTY_SETTINGS)
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
          setSettings({
            ...EMPTY_SETTINGS,
            ...response.data.settings,
          })
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

  const updateField = (event) => {
    const { name, value } = event.target

    setSettings((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const saveSettings = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/admin/contact', settings)
      setSettings(response.data.settings)
      setSuccess('Contact details saved and published successfully.')
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
          <p>Manage enquiry delivery and the contact details shown on the website.</p>
        </div>
      </div>

      {error ? <p className="contact-admin-message contact-admin-error">{error}</p> : null}
      {success ? <p className="contact-admin-message contact-admin-success">{success}</p> : null}

      <form className="contact-admin-card" onSubmit={saveSettings}>
        <div className="contact-admin-card-icon" aria-hidden="true">
          <Mail size={22} />
        </div>

        <div className="contact-admin-card-content">
          <div className="contact-admin-field">
            <label htmlFor="recipientEmail">Enquiry recipient email</label>
            <p>Quote requests are delivered privately to this address.</p>
            <input
              id="recipientEmail"
              name="recipientEmail"
              type="email"
              value={settings.recipientEmail}
              onChange={updateField}
              placeholder="sales@ayosons.com"
              required
              disabled={loading || saving}
            />
          </div>

          <div className="contact-admin-section-heading">
            <h2>Public contact details</h2>
            <p>These details appear in the website contact section and footer.</p>
          </div>

          <div className="contact-admin-fields">
            {PUBLIC_FIELDS.map((field) => (
              <div className="contact-admin-field" key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={settings[field.name]}
                  onChange={updateField}
                  placeholder={field.placeholder}
                  disabled={loading || saving}
                />
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading || saving}>
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Contact Details'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Contact
