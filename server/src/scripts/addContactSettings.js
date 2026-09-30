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
      public_email VARCHAR(255) NOT NULL DEFAULT '',
      phone_number VARCHAR(50) NOT NULL DEFAULT '',
      whatsapp_number VARCHAR(50) NOT NULL DEFAULT '',
      linkedin_url VARCHAR(500) NOT NULL DEFAULT '',
      instagram_url VARCHAR(500) NOT NULL DEFAULT '',
      facebook_url VARCHAR(500) NOT NULL DEFAULT '',
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `)

  const columns = [
    ['public_email', "VARCHAR(255) NOT NULL DEFAULT ''"],
    ['phone_number', "VARCHAR(50) NOT NULL DEFAULT ''"],
    ['whatsapp_number', "VARCHAR(50) NOT NULL DEFAULT ''"],
    ['linkedin_url', "VARCHAR(500) NOT NULL DEFAULT ''"],
    ['instagram_url', "VARCHAR(500) NOT NULL DEFAULT ''"],
    ['facebook_url', "VARCHAR(500) NOT NULL DEFAULT ''"],
  ]

  const [existingColumns] = await connection.execute(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'contact_settings'
  `, [process.env.MYSQL_DATABASE])

  const existingNames = new Set(
    existingColumns.map((column) => column.COLUMN_NAME)
  )

  for (const [name, definition] of columns) {
    if (!existingNames.has(name)) {
      await connection.execute(
        `ALTER TABLE contact_settings ADD COLUMN ${name} ${definition}`
      )
    }
  }

  await connection.execute(`
    INSERT INTO contact_settings (id, recipient_email)
    VALUES (1, ?)
    ON DUPLICATE KEY UPDATE id = id
  `, [''])

  console.log('Contact settings table is ready.')
} finally {
  await connection.end()
}
