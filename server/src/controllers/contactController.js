import pool from '../config/mysql.js'
import { Resend } from 'resend'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()

const getInquiryRecipient = (settings) => {
  const adminRecipient = normalizeEmail(settings?.recipient_email)
  const fallbackRecipient = normalizeEmail(
    process.env.CONTACT_RECIPIENT_EMAIL
  )

  if (emailPattern.test(adminRecipient)) return adminRecipient
  if (emailPattern.test(fallbackRecipient)) return fallbackRecipient

  return ''
}

const isValidPublicUrl = (value) => {
  if (!value) return true

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const getContactSettings = async () => {
  const [rows] = await pool.execute(`
    SELECT
      recipient_email,
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
        recipientEmail: settings?.recipient_email || '',
        ...formatPublicSettings(settings),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateAdminContactSettings = async (req, res, next) => {
  try {
    const recipientEmail = normalizeEmail(req.body?.recipientEmail)
    const publicEmail = normalizeEmail(req.body?.email)
    const phone = String(req.body?.phone || '').trim()
    const whatsapp = String(req.body?.whatsapp || '').trim()
    const linkedin = String(req.body?.linkedin || '').trim()
    const instagram = String(req.body?.instagram || '').trim()
    const facebook = String(req.body?.facebook || '').trim()

    if (!emailPattern.test(recipientEmail)) {
      res.status(400)
      throw new Error('Please enter a valid recipient email address.')
    }

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
      VALUES (1, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        recipient_email = VALUES(recipient_email),
        public_email = VALUES(public_email),
        phone_number = VALUES(phone_number),
        whatsapp_number = VALUES(whatsapp_number),
        linkedin_url = VALUES(linkedin_url),
        instagram_url = VALUES(instagram_url),
        facebook_url = VALUES(facebook_url)
    `, [
      recipientEmail,
      publicEmail,
      phone,
      whatsapp,
      linkedin,
      instagram,
      facebook,
    ])

    res.status(200).json({
      success: true,
      message: 'Contact email updated successfully.',
      settings: {
        recipientEmail,
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

    const settings = await getContactSettings()
    const recipientEmail = getInquiryRecipient(settings)

    if (!recipientEmail) {
      res.status(503)
      throw new Error(
        'A valid enquiry recipient email has not been configured in admin yet.'
      )
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
      res.status(503)
      throw new Error('Email delivery is not configured yet.')
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const subject = `New AYOSONS quote request from ${fields.name}`
    const details = [
      ['Name', fields.name],
      ['Email', fields.email],
      ['Phone / WhatsApp', fields.phone],
      ['Country', fields.country],
      ['Company / Brand', fields.company],
      ['Product Category', fields.productCategory],
      ['Estimated Quantity', fields.quantity],
      ['Requirement', fields.requirement],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
      .join('')

    const plainTextDetails = [
      ['Name', fields.name],
      ['Email', fields.email],
      ['Phone / WhatsApp', fields.phone],
      ['Country', fields.country],
      ['Company / Brand', fields.company],
      ['Product Category', fields.productCategory],
      ['Estimated Quantity', fields.quantity],
      ['Requirement', fields.requirement],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join('\n')

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [recipientEmail],
      replyTo: fields.email,
      subject,
      html: `${details}<p><strong>Message:</strong></p><p>${escapeHtml(fields.message).replace(/\n/g, '<br />')}</p>`,
      text: `${plainTextDetails}\n\nMessage:\n${fields.message}`,
    })

    if (error) {
      console.error('Resend inquiry error:', error)
      res.status(502)
      throw new Error('Unable to send your enquiry right now.')
    }

    if (!data?.id) {
      console.error('Resend inquiry error: no delivery ID returned')
      res.status(502)
      throw new Error('Unable to confirm enquiry delivery right now.')
    }

    res.status(200).json({
      success: true,
      message: 'Your enquiry has been sent successfully.',
    })
  } catch (error) {
    next(error)
  }
}
