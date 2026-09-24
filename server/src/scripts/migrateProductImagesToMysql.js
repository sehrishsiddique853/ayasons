import 'dotenv/config'

import pool from '../config/mysql.js'


const migrateProductImages =
  async () => {
    let connection

    try {
      connection =
        await pool.getConnection()

      await connection.beginTransaction()


      console.log(
        'Migrating product images into MySQL...'
      )


      /*
      |--------------------------------------------------------------------------
      | Copy Category Collection Image Into Its Products
      |--------------------------------------------------------------------------
      |
      | At the moment every seeded product uses its category image.
      |
      | Later the admin can upload a unique image for each product.
      |
      */

      const [result] =
        await connection.query(`
          UPDATE products p

          INNER JOIN categories c
            ON c.id = p.category_id

          SET
            p.image_blob =
              c.collection_image_blob,

            p.image_mime =
              c.collection_image_mime,

            p.image_name =
              c.collection_image_name

          WHERE
            c.collection_image_blob
              IS NOT NULL
        `)


      await connection.commit()


      console.log(
        `Products updated: ${result.affectedRows}`
      )


      /*
      |--------------------------------------------------------------------------
      | Verify
      |--------------------------------------------------------------------------
      */

      const [rows] =
        await connection.query(`
          SELECT
            COUNT(*) AS total_products,

            SUM(
              CASE
                WHEN image_blob IS NOT NULL
                THEN 1
                ELSE 0
              END
            ) AS products_with_images

          FROM products
        `)


      console.log(
        `Total products: ${rows[0].total_products}`
      )

      console.log(
        `Products with MySQL images: ${rows[0].products_with_images}`
      )


      console.log(
        '\nProduct images successfully stored inside MySQL.'
      )

    } catch (error) {

      if (connection) {
        await connection.rollback()
      }


      console.error(
        '\nProduct image migration failed:'
      )

      console.error(
        error.message
      )

      process.exitCode = 1

    } finally {

      if (connection) {
        connection.release()
      }

      await pool.end()
    }
  }


migrateProductImages()