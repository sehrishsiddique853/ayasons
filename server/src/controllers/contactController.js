import pool from '../config/mysql.js'
import nodemailer from 'nodemailer'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const inquiryRecipient = 'sehrishsiddique3602@gmail.com'

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

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

    if (!fields.name || !emailPattern.test(fields.email) || !fields.message) {
      res.status(400)
      throw new Error('Please enter your name, a valid email address and a message.')
    }

    const gmailUser = String(
      process.env.GMAIL_USER || ''
    ).trim()
    const gmailAppPassword = String(
      process.env.GMAIL_APP_PASSWORD || ''
    ).trim()

    if (!emailPattern.test(gmailUser) || !gmailAppPassword) {
      res.status(503)
      throw new Error('Email delivery is not configured yet.')
    }

    const details = [
      ['Name', fields.name],
      ['Email', fields.email],
      ['Phone / WhatsApp', fields.phone],
      ['Country', fields.country],
      ['Company / Brand', fields.company],
      ['Product Category', fields.productCategory],
      ['Estimated Quantity', fields.quantity],
      ['Requirement', fields.requirement],
    ].filter(([, value]) => value)

    const htmlDetails = details
      .map(([label, value]) => (
        `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
      ))
      .join('')

    const textDetails = details
      .map(([label, value]) => `${label}: ${value}`)
      .join('\n')

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    const adminDelivery = await transporter.sendMail({
      from: `AYOSONS Website <${gmailUser}>`,
      to: inquiryRecipient,
      replyTo: fields.email,
      subject: `New AYOSONS contact message from ${fields.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#111;">
          <h2 style="margin-bottom:6px;">New Contact Message</h2>
          <p style="color:#666;margin-top:0;">Submitted through the AYOSONS website contact form.</p>
          <div style="padding:16px;background:#f6f6f6;border-radius:8px;margin:18px 0;">
            ${htmlDetails}
          </div>
          <div>
            <strong>Message:</strong>
            <p style="line-height:1.6;">${escapeHtml(fields.message).replace(/\n/g, '<br />')}</p>
          </div>
        </div>
      `,
      text: `${textDetails}\n\nMessage:\n${fields.message}`,
    })

    const customerDelivery = await transporter.sendMail({
      from: `AYOSONS <${gmailUser}>`,
      to: fields.email,
      replyTo: inquiryRecipient,
      subject: 'Your message has been sent to AYOSONS',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#111;">
          <h2>Your Message Has Been Sent</h2>
          <p>Thank you, ${escapeHtml(fields.name)}.</p>
          <p>Your message has been sent successfully to AYOSONS. Our team has received your enquiry and will get back to you as soon as possible.</p>
          <div style="margin:22px 0;padding:16px;background:#f6f6f6;border-radius:8px;">
            <strong>Your message</strong>
            <p style="line-height:1.6;margin-bottom:0;">${escapeHtml(fields.message).replace(/\n/g, '<br />')}</p>
          </div>
          <p style="color:#666;">You can reply to this email if you need to add more information.</p>
        </div>
      `,
      text: `Thank you, ${fields.name}.\n\nYour message has been sent successfully to AYOSONS. Our team has received your enquiry and will get back to you as soon as possible.\n\nYour message:\n${fields.message}`,
    })

    if (!adminDelivery?.messageId || !customerDelivery?.messageId) {
      console.error('Gmail SMTP error: one or more contact emails were not confirmed')
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
