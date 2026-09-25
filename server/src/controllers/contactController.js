import pool from '../config/mysql.js'
import { Resend } from 'resend'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const getContactSettings = async () => {
  const [rows] = await pool.execute(`
    SELECT recipient_email
    FROM contact_settings
    WHERE id = 1
    LIMIT 1
  `)

  return rows[0] || null
}

export const getAdminContactSettings = async (req, res, next) => {
  try {
    const settings = await getContactSettings()

    res.status(200).json({
      success: true,
      settings: {
        recipientEmail: settings?.recipient_email || '',
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateAdminContactSettings = async (req, res, next) => {
  try {
    const recipientEmail = String(
      req.body?.recipientEmail || ''
    ).trim().toLowerCase()

    if (!emailPattern.test(recipientEmail)) {
      res.status(400)
      throw new Error('Please enter a valid recipient email address.')
    }

    await pool.execute(`
      INSERT INTO contact_settings (id, recipient_email)
      VALUES (1, ?)
      ON DUPLICATE KEY UPDATE
        recipient_email = VALUES(recipient_email)
    `, [recipientEmail])

    res.status(200).json({
      success: true,
      message: 'Contact email updated successfully.',
      settings: {
        recipientEmail,
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
    const recipientEmail = settings?.recipient_email || process.env.CONTACT_RECIPIENT_EMAIL

    if (!recipientEmail) {
      res.status(503)
      throw new Error('Contact email is not configured yet.')
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

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: recipientEmail,
      replyTo: fields.email,
      subject,
      html: `${details}<p><strong>Message:</strong></p><p>${escapeHtml(fields.message).replace(/\n/g, '<br />')}</p>`,
    })

    if (error) {
      console.error('Resend inquiry error:', error)
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
