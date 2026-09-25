import 'dotenv/config'

import mysql from 'mysql2/promise'


const connection =
  await mysql.createConnection({
    host:
      process.env.MYSQL_HOST ||
      'localhost',

    port:
      Number(
        process.env.MYSQL_PORT ||
        3306
      ),

    user:
      process.env.MYSQL_USER ||
      'root',

    password:
      process.env.MYSQL_PASSWORD ||
      '',

    database:
      process.env.MYSQL_DATABASE ||
      'ayosons',
  })


const ensureIndex =
  async (
    tableName,
    indexName,
    createSql
  ) => {
    const [rows] =
      await connection.execute(
        `
        SELECT COUNT(*) AS total
        FROM information_schema.statistics
        WHERE
          table_schema = DATABASE()
          AND table_name = ?
          AND index_name = ?
        `,
        [
          tableName,
          indexName,
        ]
      )


    if (
      Number(rows[0].total) > 0
    ) {
      console.log(
        `Index already exists: ${indexName}`
      )

      return
    }


    await connection.execute(
      createSql
    )


    console.log(
      `Index created: ${indexName}`
    )
  }


try {
  await ensureIndex(
    'products',
    'idx_products_featured_active_featured_order',
    `
    CREATE INDEX idx_products_featured_active_featured_order
    ON products (
      featured,
      active,
      featured_order
    )
    `
  )
} finally {
  await connection.end()
}
