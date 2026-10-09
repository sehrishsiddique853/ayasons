import nodemailer from 'nodemailer'

const readBoolean = (value, fallback = false) => {
  const normalized = String(value ?? '').trim().toLowerCase()

  if (!normalized) return fallback

  return ['1', 'true', 'yes', 'on'].includes(normalized)
}

export const getGmailTransport = () => {
  const user = String(
    process.env.SMTP_USER ||
    process.env.GMAIL_USER ||
    ''
  ).trim()

  const password = String(
    process.env.SMTP_PASS ||
    process.env.GMAIL_APP_PASSWORD ||
    ''
  ).trim()

  const host = String(
    process.env.SMTP_HOST ||
    ''
  ).trim()

  const port = Number(
    process.env.SMTP_PORT ||
    0
  )

  const secure = readBoolean(
    process.env.SMTP_SECURE,
    false
  )

  if (!user || !password || !host || !Number.isInteger(port) || port <= 0) {
    const error = new Error(
      'Email delivery is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER and SMTP_PASS on the server.'
    )
    error.statusCode = 503
    throw error
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    auth: {
      user,
      pass: password,
    },
  })

  return {
    user,
    transporter,
  }
}
