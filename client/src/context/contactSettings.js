import { createContext, useContext } from 'react'

export const DEFAULT_CONTACT_SETTINGS = {
  email: 'info@ayosons.com',
  phone: '',
  whatsapp: '',
  linkedin: '',
  instagram: '',
  facebook: '',
}

export const ContactSettingsContext = createContext(DEFAULT_CONTACT_SETTINGS)

export const useContactSettings = () => useContext(ContactSettingsContext)
