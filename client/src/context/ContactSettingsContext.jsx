import { useEffect, useState } from 'react'

import api from '../services/api'
import {
  ContactSettingsContext,
  DEFAULT_CONTACT_SETTINGS,
} from './contactSettings'

export function ContactSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_CONTACT_SETTINGS)

  useEffect(() => {
    const controller = new AbortController()

    api.get('/contact/settings', {
      signal: controller.signal,
    }).then((response) => {
      setSettings((current) => ({
        ...current,
        ...response.data.settings,
      }))
    }).catch((error) => {
      if (error.code !== 'ERR_CANCELED') {
        console.error('Unable to load contact settings:', error)
      }
    })

    return () => controller.abort()
  }, [])

  return (
    <ContactSettingsContext.Provider value={settings}>
      {children}
    </ContactSettingsContext.Provider>
  )
}
