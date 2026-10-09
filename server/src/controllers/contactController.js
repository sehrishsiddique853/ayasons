import pool from '../config/mysql.js'
import nodemailer from 'nodemailer'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
      recipient_email,
      public_email,
      phone_number,
      whatsapp_number,
      linkedin_url,
      instagram_url,
      facebook_url,
      team_members_json
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
  teamMembers: parseTeamMembers(settings?.team_members_json),
})

const parseTeamMembers = (value) => {
  try {
    const members = typeof value === 'string' ? JSON.parse(value) : value
    if (!Array.isArray(members)) return []

    return members
      .map((member) => ({
        name: String(member?.name || '').trim(),
        designation: String(member?.designation || '').trim(),
      }))
      .filter((member) => member.name && member.designation)
  } catch {
    return []
  }
}

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
    const submittedTeamMembers = req.body?.teamMembers
    const teamMemberRows = Array.isArray(submittedTeamMembers)
      ? submittedTeamMembers
      : parseTeamMembers((await getContactSettings())?.team_members_json)

    if (teamMemberRows.length > 12) {
      res.status(400)
      throw new Error('You can add up to 12 team members.')
    }

    if (
      teamMemberRows.some((member) => {
        const hasName = Boolean(String(member?.name || '').trim())
        const hasDesignation = Boolean(String(member?.designation || '').trim())
        return hasName !== hasDesignation
      })
    ) {
      res.status(400)
      throw new Error('Complete both fields for each team member, or leave both blank.')
    }

    const teamMembers = parseTeamMembers(
      teamMemberRows.filter((member) =>
        String(member?.name || '').trim() &&
        String(member?.designation || '').trim()
      )
    )

    if (teamMembers.some((member) => member.name.length > 120 || member.designation.length > 120)) {
      res.status(400)
      throw new Error('Team member names and designations must be 120 characters or fewer.')
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
        facebook_url,
        team_members_json
      )
      VALUES (1, '', ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        public_email = VALUES(public_email),
        phone_number = VALUES(phone_number),
        whatsapp_number = VALUES(whatsapp_number),
        linkedin_url = VALUES(linkedin_url),
        instagram_url = VALUES(instagram_url),
        facebook_url = VALUES(facebook_url),
        team_members_json = VALUES(team_members_json)
    `, [
      publicEmail,
      phone,
      whatsapp,
      linkedin,
      instagram,
      facebook,
      JSON.stringify(teamMembers),
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
        teamMembers,
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
      email: normalizeEmail(req.body?.email),
      phone: String(req.body?.phone || '').trim(),
      country: String(req.body?.country || '').trim(),
      message: String(req.body?.message || '').trim(),
    }

    if (!fields.name || !emailPattern.test(fields.email) || !fields.message) {
      res.status(400)
      throw new Error('Please enter your name, a valid email address and a message.')
    }

    // Match the Gmail SMTP setup used by working order confirmations.
    const gmailUser = String(process.env.GMAIL_USER || '').trim()
    const gmailAppPassword = String(process.env.GMAIL_APP_PASSWORD || '').trim()

    if (
      !emailPattern.test(gmailUser) ||
      !gmailAppPassword
    ) {
      res.status(503)
      throw new Error(
        'Email delivery is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD on the server.'
      )
    }

    const contactSettings = await getContactSettings()

    const inquiryRecipient = [
      contactSettings?.recipient_email,
      contactSettings?.public_email,
      process.env.CONTACT_RECIPIENT,
      process.env.INQUIRY_RECIPIENT,
      gmailUser,
    ]
      .map(normalizeEmail)
      .find((email) => emailPattern.test(email))

    if (!inquiryRecipient) {
      res.status(503)
      throw new Error('AYOSONS contact email is not configured yet.')
    }

    const details = [
      ['Name', fields.name],
      ['Email', fields.email],
      ['Phone / WhatsApp', fields.phone],
      ['Country', fields.country],
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

    let adminDelivery
    let customerDelivery

    try {
      adminDelivery = await transporter.sendMail({
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

      customerDelivery = await transporter.sendMail({
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
    } catch (smtpError) {
      console.error('Contact email send failed:', {
        code: smtpError.code,
        command: smtpError.command,
        response: smtpError.response,
        rejected: smtpError.rejected,
        message: smtpError.message,
      })

      res.status(502)
      throw new Error(
        'The email server rejected the message. Check the server mail credentials and recipient address.'
      )
    }

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
