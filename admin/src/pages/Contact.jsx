import { useEffect, useState } from 'react'
import { Mail, Plus, Save, Trash2, Users } from 'lucide-react'

import api from '../services/api'

import '../styles/contact.css'

const EMPTY_SETTINGS = {
  email: '',
  phone: '',
  whatsapp: '',
  linkedin: '',
  instagram: '',
  facebook: '',
  teamMembers: [],
}

const DEFAULT_TEAM_MEMBERS = [
  { name: '', designation: '' },
  { name: '', designation: '' },
  { name: '', designation: '' },
  { name: '', designation: '' },
]

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
            teamMembers: response.data.settings.teamMembers?.length
              ? response.data.settings.teamMembers
              : DEFAULT_TEAM_MEMBERS,
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

  const updateTeamMember = (index, field, value) => {
    setSettings((current) => ({
      ...current,
      teamMembers: current.teamMembers.map((member, memberIndex) =>
        memberIndex === index
          ? { ...member, [field]: value }
          : member
      ),
    }))
  }

  const addTeamMember = () => {
    setSettings((current) => ({
      ...current,
      teamMembers: [...current.teamMembers, { name: '', designation: '' }],
    }))
  }

  const removeTeamMember = (index) => {
    setSettings((current) => ({
      ...current,
      teamMembers: current.teamMembers.filter((_, memberIndex) => memberIndex !== index),
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
      setSuccess('Contact details and team members saved successfully.')
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
          <p>Manage public contact details and the team shown on the About page.</p>
        </div>
      </div>

      {error ? <p className="contact-admin-message contact-admin-error">{error}</p> : null}
      {success ? <p className="contact-admin-message contact-admin-success">{success}</p> : null}

      <form className="contact-admin-card" onSubmit={saveSettings}>
        <div className="contact-admin-card-icon" aria-hidden="true">
          <Mail size={22} />
        </div>

        <div className="contact-admin-card-content">
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

          <div className="contact-admin-team-heading">
            <div className="contact-admin-card-icon" aria-hidden="true">
              <Users size={21} />
            </div>
            <div>
              <h2>About page team</h2>
              <p>Enter the name and designation shown on each team card.</p>
            </div>
          </div>

          <div className="contact-admin-team-list">
            {settings.teamMembers.map((member, index) => (
              <div className="contact-admin-team-member" key={index}>
                <div className="contact-admin-field">
                  <label htmlFor={`team-name-${index}`}>Name</label>
                  <input
                    id={`team-name-${index}`}
                    value={member.name}
                    onChange={(event) => updateTeamMember(index, 'name', event.target.value)}
                    placeholder="Full name"
                    maxLength={120}
                    disabled={loading || saving}
                  />
                </div>
                <div className="contact-admin-field">
                  <label htmlFor={`team-designation-${index}`}>Designation</label>
                  <input
                    id={`team-designation-${index}`}
                    value={member.designation}
                    onChange={(event) => updateTeamMember(index, 'designation', event.target.value)}
                    placeholder="e.g. Production Manager"
                    maxLength={120}
                    disabled={loading || saving}
                  />
                </div>
                <button
                  className="contact-admin-remove-team-member"
                  type="button"
                  aria-label={`Remove team member ${index + 1}`}
                  onClick={() => removeTeamMember(index)}
                  disabled={loading || saving}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          <button
            className="contact-admin-add-team-member"
            type="button"
            onClick={addTeamMember}
            disabled={loading || saving || settings.teamMembers.length >= 12}
          >
            <Plus size={17} />
            Add team member
          </button>

          <button type="submit" disabled={loading || saving}>
            <Save size={17} />
            {saving ? 'Saving...' : 'Save Contact & Team'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Contact
