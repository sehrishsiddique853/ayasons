import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'

import {
  fileURLToPath,
} from 'node:url'

import mysql from 'mysql2/promise'


const __filename =
  fileURLToPath(
    import.meta.url
  )

const __dirname =
  path.dirname(
    __filename
  )


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

          multipleStatements:
            true,
        })


      const migrationPath =
        path.resolve(
          __dirname,
          '../sql/addImageBlobs.sql'
        )


      const sql =
        await fs.readFile(
          migrationPath,
          'utf8'
        )


      await connection.query(
        sql
      )


      console.log(
        'Image BLOB columns added successfully.'
      )


      console.log(
        '✓ categories.hero_image_blob'
      )

      console.log(
        '✓ categories.collection_image_blob'
      )

      console.log(
        '✓ products.image_blob'
      )

    } catch (error) {

      console.error(
        'Image BLOB migration failed:'
      )

      console.error(
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