import pool from '../config/mysql.js'
import nodemailer from 'nodemailer'
import { invalidInput, readText } from '../utils/inputValidation.js'

let quoteAddressColumnsPromise

const ensureQuoteAddressColumns = async () => {
  if (!quoteAddressColumnsPromise) {
    quoteAddressColumnsPromise = (async () => {
      const [addressColumns] = await pool.execute("SHOW COLUMNS FROM quote_requests LIKE 'address'")
      if (!addressColumns.length) {
        await pool.execute("ALTER TABLE quote_requests ADD COLUMN address VARCHAR(500) NOT NULL DEFAULT '' AFTER country")
      }

      const [postalCodeColumns] = await pool.execute("SHOW COLUMNS FROM quote_requests LIKE 'postal_code'")
      if (!postalCodeColumns.length) {
        await pool.execute("ALTER TABLE quote_requests ADD COLUMN postal_code VARCHAR(40) NOT NULL DEFAULT '' AFTER address")
      }
    })().catch((error) => {
      quoteAddressColumnsPromise = null
      throw error
    })
  }

  return quoteAddressColumnsPromise
}

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

  if (items.some((item) => !item || typeof item !== 'object' || Array.isArray(item))) {
    throw invalidInput('Each cart item must be a valid object.')
  }

  return items
    .slice(0, 100)
    .map((item, index) => {
      const itemName = readText(item.itemName, `Cart item ${index + 1} name`, { maxLength: 180 })
      const rawQuantity = Number(item.quantity ?? 1)
      if (!Number.isSafeInteger(rawQuantity) || rawQuantity < 1 || rawQuantity > 10000) {
        throw invalidInput(`Cart item ${index + 1} quantity must be a whole number from 1 to 10,000.`)
      }

      const readOptional = (key, maxLength = 500) =>
        readText(item[key] ?? '', `Cart item ${index + 1} ${key}`, { required: false, maxLength })

      return {
        productName: readOptional('productName', 180),
        itemName,
        size: readOptional('size', 80),
        color: readOptional('color', 80),
        colorMode: readOptional('colorMode', 40),
        colorSelections: item.colorSelections && typeof item.colorSelections === 'object' && !Array.isArray(item.colorSelections)
          ? item.colorSelections
          : {},
        quantity: rawQuantity,
        playerName: readOptional('playerName', 120),
        playerNumber: readOptional('playerNumber', 20),
        logoName: readOptional('logoName', 255),
        notes: readOptional('notes', 5000),
        options: item.options && typeof item.options === 'object' && !Array.isArray(item.options)
          ? item.options
          : {},
        logoUploadIndex: Number.isInteger(Number(item.logoUploadIndex))
          ? Number(item.logoUploadIndex)
          : null,
      }
    })
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
  try {
    const body = req.body || {}
    const customer = {
      name: readText(body.name, 'Name', { maxLength: 160 }),
      email: readText(body.email, 'Email', { maxLength: 255 }).toLowerCase(),
      phone: readText(body.phone ?? '', 'Phone number', { required: false, maxLength: 80 }),
      company: readText(body.company ?? '', 'Company', { required: false, maxLength: 180 }),
      country: readText(body.country ?? '', 'Country', { required: false, maxLength: 120 }),
      address: readText(body.address ?? '', 'Address', { required: false, maxLength: 500 }),
      postalCode: readText(body.postalCode ?? '', 'Postal code', { required: false, maxLength: 40 }),
      message: readText(body.message ?? '', 'Message', { required: false, maxLength: 20000 }),
    }

    const items = normalizeItems(body.items)

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
        address VARCHAR(500) NOT NULL DEFAULT '',
        postal_code VARCHAR(40) NOT NULL DEFAULT '',
        message TEXT NULL,
        items_json JSON NOT NULL,
        status VARCHAR(40) NOT NULL DEFAULT 'new',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_quote_requests_created_at (created_at),
        KEY idx_quote_requests_status (status)
      )
    `)

    await ensureQuoteAddressColumns()

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS quote_request_files (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        quote_id BIGINT UNSIGNED NOT NULL,
        item_name VARCHAR(180) NOT NULL DEFAULT '',
        file_name VARCHAR(255) NOT NULL,
        file_mime VARCHAR(100) NOT NULL,
        file_blob LONGBLOB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_quote_request_files_quote (quote_id),
        CONSTRAINT fk_quote_request_files_quote
          FOREIGN KEY (quote_id)
          REFERENCES quote_requests(id)
          ON DELETE CASCADE
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
        address,
        postal_code,
        message,
        items_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customer.name,
        customer.email,
        customer.phone,
        customer.company,
        customer.country,
        customer.address,
        customer.postalCode,
        customer.message,
        JSON.stringify(items),
      ]
    )

    const logoFiles = Array.isArray(req.files) ? req.files : []

    for (const item of items) {
      if (
        item.logoUploadIndex === null ||
        !logoFiles[item.logoUploadIndex]
      ) {
        continue
      }

      const file = logoFiles[item.logoUploadIndex]

      await pool.execute(
        `
        INSERT INTO quote_request_files (
          quote_id,
          item_name,
          file_name,
          file_mime,
          file_blob
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          insertResult.insertId,
          item.itemName,
          file.originalname,
          file.mimetype,
          file.buffer,
        ]
      )
    }

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

      return `order-${insertResult.insertId}-logo-${index}@ayosons`
    }

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#111;">
        <h2 style="margin-bottom:6px;">New AYOSONS Order</h2>
        <p style="color:#666;margin-top:0;">Reference #${insertResult.insertId}</p>

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
      `AYOSONS Order #${insertResult.insertId}`,
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

    const adminDelivery = await transporter.sendMail({
      from: `AYOSONS Website <${gmailUser}>`,
      to: recipient,
      replyTo: customer.email,
      subject: `New AYOSONS order #${insertResult.insertId} from ${customer.name}`,
      html: customerHtml,
      text: customerText,
      attachments: emailAttachments,
    })

    const confirmationDelivery = await transporter.sendMail({
      from: `AYOSONS <${gmailUser}>`,
      to: customer.email,
      replyTo: recipient,
      subject: `Your AYOSONS order #${insertResult.insertId} is confirmed`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:760px;margin:auto;color:#111;">
          <h2>Order Confirmed</h2>
          <p>Thank you, ${escapeHtml(customer.name)}. Your AYOSONS order has been placed successfully and is now confirmed.</p>
          <p style="color:#666;">Order #${insertResult.insertId}</p>
          <p><strong>Delivery details</strong><br/>
            ${[customer.address, customer.postalCode, customer.country].filter(Boolean).map(escapeHtml).join('<br/>') || 'Not provided'}
          </p>
          ${items.map((item, index) =>
            itemHtml(item, index, getLogoPreviewCid(item, index))
          ).join('')}
          <p>Our team will review your order details and contact you if any additional production, payment or shipping information is required.</p>
        </div>
      `,
      text: `Order Confirmed\n\nThank you, ${customer.name}. Your AYOSONS order #${insertResult.insertId} has been placed successfully and is confirmed.\n\nDelivery details:\n${[customer.address, customer.postalCode, customer.country].filter(Boolean).join(', ') || 'Not provided'}\n\n${items.map(itemText).join('\n\n')}\n\nOur team will review your order and contact you if any additional production, payment or shipping information is required.`,
      attachments: emailAttachments,
    })

    if (!adminDelivery?.messageId || !confirmationDelivery?.messageId) {
      res.status(502)
      throw new Error('Unable to confirm email delivery.')
    }

    res.status(201).json({
      success: true,
      message: 'Order placed and confirmed successfully.',
      quoteId: insertResult.insertId,
      orderId: insertResult.insertId,
    })
  } catch (error) {
    next(error)
  }
}
