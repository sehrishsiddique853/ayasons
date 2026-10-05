import pool from '../config/mysql.js'
import nodemailer from 'nodemailer'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return []

  return items
    .slice(0, 100)
    .map((item) => ({
      productName: String(item.productName || '').trim(),
      itemName: String(item.itemName || '').trim(),
      size: String(item.size || '').trim(),
      color: String(item.color || '').trim(),
      colorSelections:
        item.colorSelections && typeof item.colorSelections === 'object'
          ? item.colorSelections
          : {},
      quantity: Math.max(1, Number(item.quantity) || 1),
      playerName: String(item.playerName || '').trim(),
      playerNumber: String(item.playerNumber || '').trim(),
      logoName: String(item.logoName || '').trim(),
      notes: String(item.notes || '').trim(),
      options:
        item.options && typeof item.options === 'object'
          ? item.options
          : {},
    }))
    .filter((item) => item.itemName)
}

const detailsRowsHtml = (item) => {
  const rows = []

  if (item.size) rows.push(['Size', item.size])
  rows.push(['Quantity', item.quantity])

  const zoneEntries = Object.entries(item.colorSelections || {})
  if (zoneEntries.length) {
    zoneEntries.forEach(([zone, value]) => {
      rows.push([zone, value])
    })
  } else if (item.color) {
    rows.push(['Color', item.color])
  }

  Object.entries(item.options || {}).forEach(([key, value]) => {
    if (value) {
      const label = key
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
      rows.push([label, value])
    }
  })

  if (item.playerName) rows.push(['Player Name', item.playerName])
  if (item.playerNumber) rows.push(['Player Number', item.playerNumber])
  if (item.logoName) rows.push(['Logo File', item.logoName])
  if (item.notes) rows.push(['Special Instructions', item.notes])

  return rows
    .map(([label, value]) =>
      `<tr>
        <td style="padding:7px 10px;border-bottom:1px solid #ececec;color:#666;width:180px;">${escapeHtml(label)}</td>
        <td style="padding:7px 10px;border-bottom:1px solid #ececec;color:#111;font-weight:600;">${escapeHtml(value)}</td>
      </tr>`
    )
    .join('')
}

const itemHtml = (item, index) => `
  <div style="margin:0 0 22px;border:1px solid #e2e2e2;border-radius:10px;overflow:hidden;">
    <div style="padding:12px 14px;background:#111;color:#fff;">
      <strong>${index + 1}. ${escapeHtml(item.productName || 'Product')} — ${escapeHtml(item.itemName)}</strong>
    </div>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;">
      ${detailsRowsHtml(item)}
    </table>
  </div>
`

const itemText = (item, index) => {
  const lines = [
    `${index + 1}. ${item.productName || 'Product'} - ${item.itemName}`,
  ]

  if (item.size) lines.push(`Size: ${item.size}`)
  lines.push(`Quantity: ${item.quantity}`)

  const zoneEntries = Object.entries(item.colorSelections || {})
  if (zoneEntries.length) {
    zoneEntries.forEach(([zone, value]) => lines.push(`${zone}: ${value}`))
  } else if (item.color) {
    lines.push(`Color: ${item.color}`)
  }

  Object.entries(item.options || {}).forEach(([key, value]) => {
    if (value) lines.push(`${key.replace(/-/g, ' ')}: ${value}`)
  })

  if (item.playerName) lines.push(`Player Name: ${item.playerName}`)
  if (item.playerNumber) lines.push(`Player Number: ${item.playerNumber}`)
  if (item.logoName) lines.push(`Logo File: ${item.logoName}`)
  if (item.notes) lines.push(`Special Instructions: ${item.notes}`)

  return lines.join('\n')
}

export const submitCartQuote = async (req, res, next) => {
  try {
    const customer = {
      name: String(req.body?.name || '').trim(),
      email: String(req.body?.email || '').trim().toLowerCase(),
      phone: String(req.body?.phone || '').trim(),
      company: String(req.body?.company || '').trim(),
      country: String(req.body?.country || '').trim(),
      message: String(req.body?.message || '').trim(),
    }

    const items = normalizeItems(req.body?.items)

    if (!customer.name || !emailPattern.test(customer.email) || !items.length) {
      res.status(400)
      throw new Error('Name, valid email and at least one cart item are required.')
    }

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS quote_requests (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        customer_name VARCHAR(160) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(80) NOT NULL DEFAULT '',
        company VARCHAR(180) NOT NULL DEFAULT '',
        country VARCHAR(120) NOT NULL DEFAULT '',
        message TEXT NULL,
        items_json JSON NOT NULL,
        status VARCHAR(40) NOT NULL DEFAULT 'new',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_quote_requests_created_at (created_at),
        KEY idx_quote_requests_status (status)
      )
    `)

    const [insertResult] = await pool.execute(
      `
      INSERT INTO quote_requests (
        customer_name,
        customer_email,
        customer_phone,
        company,
        country,
        message,
        items_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.company,
        customer.country,
        customer.message,
        JSON.stringify(items),
      ]
    )

    const [settingsRows] = await pool.execute(`
      SELECT recipient_email
      FROM contact_settings
      WHERE id = 1
      LIMIT 1
    `)

    const gmailUser = String(process.env.GMAIL_USER || '').trim()
    const gmailAppPassword = String(process.env.GMAIL_APP_PASSWORD || '').trim()

    const recipient =
      String(settingsRows[0]?.recipient_email || '').trim() ||
      gmailUser

    if (!emailPattern.test(gmailUser) || !gmailAppPassword || !emailPattern.test(recipient)) {
      res.status(503)
      throw new Error('Email delivery is not configured yet.')
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    const totalQuantity = items.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    )

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#111;">
        <h2 style="margin-bottom:6px;">AYOSONS Custom Quote Request</h2>
        <p style="color:#666;margin-top:0;">Reference #${insertResult.insertId}</p>

        <div style="padding:14px;background:#f6f6f6;border-radius:8px;margin-bottom:20px;">
          <strong>${escapeHtml(customer.name)}</strong><br/>
          ${escapeHtml(customer.email)}
          ${customer.phone ? `<br/>${escapeHtml(customer.phone)}` : ''}
          ${customer.company ? `<br/>${escapeHtml(customer.company)}` : ''}
          ${customer.country ? `<br/>${escapeHtml(customer.country)}` : ''}
        </div>

        <p><strong>Items:</strong> ${items.length} &nbsp; <strong>Total quantity:</strong> ${totalQuantity}</p>

        ${items.map(itemHtml).join('')}

        ${customer.message
          ? `<div style="margin-top:18px;"><strong>Customer Message</strong><p>${escapeHtml(customer.message).replace(/\n/g, '<br/>')}</p></div>`
          : ''}
      </div>
    `

    const customerText = [
      `AYOSONS Custom Quote Request #${insertResult.insertId}`,
      `Customer: ${customer.name}`,
      `Email: ${customer.email}`,
      customer.phone ? `Phone: ${customer.phone}` : '',
      customer.company ? `Company: ${customer.company}` : '',
      customer.country ? `Country: ${customer.country}` : '',
      '',
      `Items: ${items.length}`,
      `Total quantity: ${totalQuantity}`,
      '',
      ...items.map(itemText),
      customer.message ? `\nCustomer Message:\n${customer.message}` : '',
    ].filter(Boolean).join('\n')

    const adminDelivery = await transporter.sendMail({
      from: `AYOSONS Website <${gmailUser}>`,
      to: recipient,
      replyTo: customer.email,
      subject: `New custom order #${insertResult.insertId} from ${customer.name}`,
      html: customerHtml,
      text: customerText,
    })

    const confirmationDelivery = await transporter.sendMail({
      from: `AYOSONS <${gmailUser}>`,
      to: customer.email,
      replyTo: recipient,
      subject: `We received your AYOSONS custom order request #${insertResult.insertId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#111;">
          <h2>Thank you, ${escapeHtml(customer.name)}.</h2>
          <p>We received your custom product request. Below is a clear copy of the specifications you submitted.</p>
          <p style="color:#666;">Reference #${insertResult.insertId}</p>
          ${items.map(itemHtml).join('')}
          <p>Our team can reply to this email with pricing, production details and next steps.</p>
        </div>
      `,
      text: `Thank you, ${customer.name}.\n\nWe received your AYOSONS custom product request #${insertResult.insertId}.\n\n${items.map(itemText).join('\n\n')}\n\nOur team can reply with pricing and next steps.`,
    })

    if (!adminDelivery?.messageId || !confirmationDelivery?.messageId) {
      res.status(502)
      throw new Error('Unable to confirm email delivery.')
    }

    res.status(201).json({
      success: true,
      message: 'Quote request sent successfully.',
      quoteId: insertResult.insertId,
    })
  } catch (error) {
    next(error)
  }
}
