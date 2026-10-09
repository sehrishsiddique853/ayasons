import pool from '../config/mysql.js'
import { getGmailTransport } from '../config/gmailTransporter.js'
import { randomUUID } from 'node:crypto'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const normalizeItems = (items) => {
  if (typeof items === 'string') {
    try {
      items = JSON.parse(items)
    } catch {
      return []
    }
  }

  if (!Array.isArray(items)) return []

  return items
    .slice(0, 100)
    .map((item) => ({
      productName: String(item.productName || '').trim(),
      itemName: String(item.itemName || '').trim(),
      size: String(item.size || '').trim(),
      color: String(item.color || '').trim(),
      colorMode: String(item.colorMode || '').trim(),
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
      logoUploadIndex:
        Number.isInteger(Number(item.logoUploadIndex))
          ? Number(item.logoUploadIndex)
          : null,
    }))
    .filter((item) => item.itemName)
}

const detailsRowsHtml = (item) => {
  const rows = []

  if (item.size) rows.push(['Size', item.size])
  rows.push(['Quantity', item.quantity])

  if (item.colorMode) {
    rows.push([
      'Color Setup',
      item.colorMode === 'preset'
        ? 'Original Design Colors'
        : item.colorMode === 'custom-preset'
          ? 'Original Colors + Custom Changes'
          : 'Custom Main Color',
    ])
  }

  const zoneEntries = Object.entries(item.colorSelections || {})
    .filter(([, value]) => Boolean(value))

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

const itemHtml = (item, index, logoPreviewCid = '') => `
  <div style="margin:0 0 22px;border:1px solid #e2e2e2;border-radius:10px;overflow:hidden;">
    <div style="padding:12px 14px;background:#111;color:#fff;">
      <strong>${index + 1}. ${escapeHtml(item.productName || 'Product')} — ${escapeHtml(item.itemName)}</strong>
    </div>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;">
      ${detailsRowsHtml(item)}
    </table>
    ${logoPreviewCid
      ? `<div style="padding:16px;border-top:1px solid #ececec;background:#fafafa;">
          <div style="margin-bottom:10px;color:#666;font-family:Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;">Customer Logo Preview</div>
          <img
            src="cid:${escapeHtml(logoPreviewCid)}"
            alt="Customer uploaded logo"
            style="display:block;max-width:320px;max-height:220px;width:auto;height:auto;object-fit:contain;border:1px solid #e2e2e2;background:#fff;padding:10px;border-radius:8px;"
          />
        </div>`
      : ''}
  </div>
`

const itemText = (item, index) => {
  const lines = [
    `${index + 1}. ${item.productName || 'Product'} - ${item.itemName}`,
  ]

  if (item.size) lines.push(`Size: ${item.size}`)
  lines.push(`Quantity: ${item.quantity}`)

  if (item.colorMode) {
    lines.push(
      `Color Setup: ${
        item.colorMode === 'preset'
          ? 'Original Design Colors'
          : item.colorMode === 'custom-preset'
            ? 'Original Colors + Custom Changes'
            : 'Custom Main Color'
      }`
    )
  }

  const zoneEntries = Object.entries(item.colorSelections || {})
    .filter(([, value]) => Boolean(value))

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
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  })

  try {
    const customer = {
      name: String(req.body?.name || '').trim(),
      email: String(req.body?.email || '').trim().toLowerCase(),
      phone: String(req.body?.phone || '').trim(),
      company: String(req.body?.company || '').trim(),
      country: String(req.body?.country || '').trim(),
      address: String(req.body?.address || '').trim(),
      postalCode: String(req.body?.postalCode || '').trim(),
      message: String(req.body?.message || '').trim(),
    }

    const items = normalizeItems(req.body?.items)

    if (!customer.name || !emailPattern.test(customer.email) || !items.length) {
      res.status(400)
      throw new Error('Name, valid email and at least one cart item are required.')
    }

    const orderReference = `AY-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`
    const logoFiles = Array.isArray(req.files) ? req.files : []
    const { user: gmailUser, transporter } = getGmailTransport()

    let settingsRows = []
    try {
      ;[settingsRows] = await pool.execute(`
        SELECT recipient_email
        FROM contact_settings
        WHERE id = 1
        LIMIT 1
      `)
    } catch (error) {
      console.warn('Could not read the configured order recipient; using GMAIL_USER.', error.message)
    }

    const recipient =
      String(settingsRows[0]?.recipient_email || '').trim() ||
      gmailUser

    if (!emailPattern.test(gmailUser) || !emailPattern.test(recipient)) {
      throw new Error('Email delivery is not configured yet.')
    }

    const totalQuantity = items.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    )

    const getLogoFile = (item) => {
      if (
        item.logoUploadIndex === null ||
        !logoFiles[item.logoUploadIndex]
      ) {
        return null
      }

      return logoFiles[item.logoUploadIndex]
    }

    const getLogoPreviewCid = (item, index) => {
      const file = getLogoFile(item)

      if (!file || !String(file.mimetype || '').startsWith('image/')) {
        return ''
      }

      return `order-${orderReference}-logo-${index}@ayosons`
    }

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#111;">
        <h2 style="margin-bottom:6px;">New AYOSONS Order</h2>
        <p style="color:#666;margin-top:0;">Reference ${orderReference}</p>

        <div style="padding:14px;background:#f6f6f6;border-radius:8px;margin-bottom:20px;">
          <strong>${escapeHtml(customer.name)}</strong><br/>
          ${escapeHtml(customer.email)}
          ${customer.phone ? `<br/>${escapeHtml(customer.phone)}` : ''}
          ${customer.company ? `<br/>${escapeHtml(customer.company)}` : ''}
          ${customer.country ? `<br/>${escapeHtml(customer.country)}` : ''}
          ${customer.address ? `<br/>${escapeHtml(customer.address)}` : ''}
          ${customer.postalCode ? `<br/>${escapeHtml(customer.postalCode)}` : ''}
        </div>

        <p><strong>Items:</strong> ${items.length} &nbsp; <strong>Total quantity:</strong> ${totalQuantity}</p>

        ${items.map((item, index) =>
          itemHtml(item, index, getLogoPreviewCid(item, index))
        ).join('')}

        ${customer.message
          ? `<div style="margin-top:18px;"><strong>Customer Message</strong><p>${escapeHtml(customer.message).replace(/\n/g, '<br/>')}</p></div>`
          : ''}
      </div>
    `

    const customerText = [
      `AYOSONS Order ${orderReference}`,
      `Customer: ${customer.name}`,
      `Email: ${customer.email}`,
      customer.phone ? `Phone: ${customer.phone}` : '',
      customer.company ? `Company: ${customer.company}` : '',
      customer.country ? `Country: ${customer.country}` : '',
      customer.address ? `Address: ${customer.address}` : '',
      customer.postalCode ? `Postal code: ${customer.postalCode}` : '',
      '',
      `Items: ${items.length}`,
      `Total quantity: ${totalQuantity}`,
      '',
      ...items.map(itemText),
      customer.message ? `\nCustomer Message:\n${customer.message}` : '',
    ].filter(Boolean).join('\n')

    const emailAttachments = items
      .map((item, index) => {
        const file = getLogoFile(item)

        if (!file) {
          return null
        }

        const attachment = {
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        }

        if (String(file.mimetype || '').startsWith('image/')) {
          attachment.cid = getLogoPreviewCid(item, index)
          attachment.contentDisposition = 'inline'
        }

        return attachment
      })
      .filter(Boolean)

    const adminEmail = {
      from: `AYOSONS Website <${gmailUser}>`,
      to: recipient,
      replyTo: customer.email,
      subject: `New AYOSONS order ${orderReference} from ${customer.name}`,
      html: customerHtml,
      text: customerText,
      attachments: emailAttachments,
    }

    const confirmationEmail = {
      from: `AYOSONS <${gmailUser}>`,
      to: customer.email,
      replyTo: recipient,
      subject: `Your AYOSONS order ${orderReference} is confirmed`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#111;">
          <h2>Order Confirmed</h2>
          <p>Thank you, ${escapeHtml(customer.name)}. Your AYOSONS order has been placed successfully and is now confirmed.</p>
          <p style="color:#666;">Reference ${orderReference}</p>
          <p><strong>Delivery details</strong><br/>
            ${[customer.address, customer.postalCode, customer.country].filter(Boolean).map(escapeHtml).join('<br/>') || 'Not provided'}
          </p>
          ${items.map((item, index) =>
            itemHtml(item, index, getLogoPreviewCid(item, index))
          ).join('')}
          <p>Our team will review your order details and contact you if any additional production, payment or shipping information is required.</p>
        </div>
      `,
      text: `Order Confirmed\n\nThank you, ${customer.name}. Your AYOSONS order ${orderReference} has been placed successfully and is confirmed.\n\nDelivery details:\n${[customer.address, customer.postalCode, customer.country].filter(Boolean).join(', ') || 'Not provided'}\n\n${items.map(itemText).join('\n\n')}\n\nOur team will review your order and contact you if any additional production, payment or shipping information is required.`,
      attachments: emailAttachments,
    }

    let deliveries
    try {
      deliveries = await Promise.all([
        transporter.sendMail(adminEmail),
        transporter.sendMail(confirmationEmail),
      ])
    } catch (error) {
      console.error(`Could not send order ${orderReference} by email:`, {
        code: error.code,
        command: error.command,
        responseCode: error.responseCode,
        message: error.message,
      })
      return res.status(502).json({
        success: false,
        emailSent: false,
        message: 'Email delivery failed. This order was not saved. Please try again later or contact AYOSONS.',
      })
    }

    const expectedRecipients = [recipient, customer.email]
    const allRecipientsAccepted = deliveries.every((delivery, index) => {
      const accepted = (delivery.accepted || []).map((address) =>
        String(address).toLowerCase()
      )
      return Boolean(delivery.messageId) && accepted.includes(expectedRecipients[index].toLowerCase())
    })

    if (!allRecipientsAccepted) {
      console.error(`Email server did not accept every recipient for order ${orderReference}.`)
      return res.status(502).json({
        success: false,
        emailSent: false,
        message: 'The email server did not accept all recipients. This order was not saved; please contact AYOSONS before retrying.',
      })
    }

    return res.status(201).json({
      success: true,
      emailSent: true,
      message: `Order ${orderReference} was sent to AYOSONS by email. A confirmation was sent to your email address.`,
      orderReference,
    })
  } catch (error) {
    next(error)
  }
}
