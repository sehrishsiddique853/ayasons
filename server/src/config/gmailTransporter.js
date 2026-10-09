import nodemailer from 'nodemailer'

export const getGmailTransport = () => {
  const user = String(process.env.GMAIL_USER || '').trim()
  const password = String(process.env.GMAIL_APP_PASSWORD || '').trim()

  if (!user || !password) {
    const error = new Error(
      'Email delivery is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD on the server.'
    )
    error.statusCode = 503
    throw error
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    auth: { user, pass: password },
  })

  return { user, transporter }
}
