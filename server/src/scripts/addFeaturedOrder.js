import 'dotenv/config'

import mysql from 'mysql2/promise'


const runMigration =
  async () => {
    let connection

    try {

      connection =
        await mysql.createConnection({
          host:
            process.env.MYSQL_HOST,

          port:
            Number(
              process.env.MYSQL_PORT ||
              3306
            ),

          user:
            process.env.MYSQL_USER,

          password:
            process.env.MYSQL_PASSWORD ||
            '',

          database:
            process.env.MYSQL_DATABASE,
        })


      const [columns] =
        await connection.execute(`
          SHOW COLUMNS
          FROM products
          LIKE 'featured_order'
        `)


      if (
        columns.length === 0
      ) {

        await connection.execute(`
          ALTER TABLE products

          ADD COLUMN featured_order
            TINYINT UNSIGNED NULL
            AFTER featured
        `)


        console.log(
          '✓ products.featured_order added'
        )

      } else {

        console.log(
          '✓ featured_order already exists'
        )

      }


      const [indexes] =
        await connection.execute(`
          SHOW INDEX
          FROM products

          WHERE Key_name =
            'uq_products_featured_order'
        `)


      if (
        indexes.length === 0
      ) {

        await connection.execute(`
          ALTER TABLE products

          ADD UNIQUE KEY
            uq_products_featured_order
            (featured_order)
        `)


        console.log(
          '✓ Hot Selling slot uniqueness added'
        )

      }


      console.log(
        'Hot Selling migration complete.'
      )

    } catch (error) {

      console.error(
        'Migration failed:',
        error.message
      )

      process.exitCode = 1

    } finally {

      if (connection) {
        await connection.end()
      }

    }
  }


runMigration()