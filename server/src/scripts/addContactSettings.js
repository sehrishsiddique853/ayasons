import 'dotenv/config'

import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE,
})

try {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS contact_settings (
      id TINYINT UNSIGNED NOT NULL,
      recipient_email VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `)

  await connection.execute(`
    INSERT INTO contact_settings (id, recipient_email)
    VALUES (1, ?)
    ON DUPLICATE KEY UPDATE id = id
  `, [process.env.CONTACT_RECIPIENT_EMAIL || ''])

  console.log('Contact settings table is ready.')
} finally {
  await connection.end()
}
