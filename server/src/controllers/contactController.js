import pool from '../config/mysql.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()

const isValidPublicUrl = (value) => {
  if (!value) return true

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

const getContactSettings = async () => {
  const [rows] = await pool.execute(`
    SELECT
      public_email,
      phone_number,
      whatsapp_number,
      linkedin_url,
      instagram_url,
      facebook_url
    FROM contact_settings
    WHERE id = 1
    LIMIT 1
  `)

  return rows[0] || null
}

const formatPublicSettings = (settings) => ({
  email: settings?.public_email || '',
  phone: settings?.phone_number || '',
  whatsapp: settings?.whatsapp_number || '',
  linkedin: settings?.linkedin_url || '',
  instagram: settings?.instagram_url || '',
  facebook: settings?.facebook_url || '',
})

export const getPublicContactSettings = async (req, res, next) => {
  try {
    const settings = await getContactSettings()

    res.status(200).json({
      success: true,
      settings: formatPublicSettings(settings),
    })
  } catch (error) {
    next(error)
  }
}

export const getAdminContactSettings = async (req, res, next) => {
  try {
    const settings = await getContactSettings()

    res.status(200).json({
      success: true,
      settings: {
        ...formatPublicSettings(settings),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateAdminContactSettings = async (req, res, next) => {
  try {
    const publicEmail = normalizeEmail(req.body?.email)
    const phone = String(req.body?.phone || '').trim()
    const whatsapp = String(req.body?.whatsapp || '').trim()
    const linkedin = String(req.body?.linkedin || '').trim()
    const instagram = String(req.body?.instagram || '').trim()
    const facebook = String(req.body?.facebook || '').trim()

    if (publicEmail && !emailPattern.test(publicEmail)) {
      res.status(400)
      throw new Error('Please enter a valid public email address.')
    }

    if (![linkedin, instagram, facebook].every(isValidPublicUrl)) {
      res.status(400)
      throw new Error('Social links must be valid http or https URLs.')
    }

    await pool.execute(`
      INSERT INTO contact_settings (
        id,
        recipient_email,
        public_email,
        phone_number,
        whatsapp_number,
        linkedin_url,
        instagram_url,
        facebook_url
      )
      VALUES (1, '', ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        public_email = VALUES(public_email),
        phone_number = VALUES(phone_number),
        whatsapp_number = VALUES(whatsapp_number),
        linkedin_url = VALUES(linkedin_url),
        instagram_url = VALUES(instagram_url),
        facebook_url = VALUES(facebook_url)
    `, [
      publicEmail,
      phone,
      whatsapp,
      linkedin,
      instagram,
      facebook,
    ])

    res.status(200).json({
      success: true,
      message: 'Contact details updated successfully.',
      settings: {
        email: publicEmail,
        phone,
        whatsapp,
        linkedin,
        instagram,
        facebook,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const submitContactInquiry = async (req, res, next) => {
  try {
    const fields = {
      name: String(req.body?.name || '').trim(),
      email: String(req.body?.email || '').trim(),
      phone: String(req.body?.phone || '').trim(),
      country: String(req.body?.country || '').trim(),
      company: String(req.body?.company || '').trim(),
      productCategory: String(req.body?.productCategory || '').trim(),
      quantity: String(req.body?.quantity || '').trim(),
      requirement: String(req.body?.requirement || '').trim(),
      message: String(req.body?.message || '').trim(),
    }

    if (req.body?._gotcha) {
      return res.status(200).json({
        success: true,
        message: 'Your enquiry has been received.',
      })
    }

    if (!fields.name || !emailPattern.test(fields.email) || !fields.productCategory || !fields.message) {
      res.status(400)
      throw new Error('Please complete the required enquiry fields.')
    }

    const formspreeEndpoint = String(
      process.env.FORMSPREE_ENDPOINT || ''
    ).trim()

    if (!formspreeEndpoint) {
      res.status(503)
      throw new Error('Email delivery is not configured yet.')
    }

    const formspreeResponse = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...fields,
        _subject: `New AYOSONS quote request from ${fields.name}`,
      }),
    })

    if (!formspreeResponse.ok) {
      const formspreeError = await formspreeResponse.text()
      console.error(
        'Formspree inquiry error:',
        formspreeResponse.status,
        formspreeError
      )
      res.status(502)
      throw new Error('Unable to send your enquiry right now.')
    }

    res.status(200).json({
      success: true,
      message: 'Your enquiry has been sent successfully.',
    })
  } catch (error) {
    next(error)
  }
}
