import 'dotenv/config'

import fs from 'node:fs/promises'
import path from 'node:path'

import {
  fileURLToPath,
} from 'node:url'

import pool from '../config/mysql.js'

import {
  categoryImageFiles,
} from '../seed/seedData.js'


const __filename =
  fileURLToPath(
    import.meta.url
  )

const __dirname =
  path.dirname(
    __filename
  )


/*
|--------------------------------------------------------------------------
| MIME Type
|--------------------------------------------------------------------------
*/

const getMimeType = (
  fileName
) => {
  const extension =
    path.extname(
      fileName
    ).toLowerCase()


  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  }


  return (
    mimeTypes[extension] ||
    'application/octet-stream'
  )
}


/*
|--------------------------------------------------------------------------
| Image Source Directory
|--------------------------------------------------------------------------
|
| We read the original images from:
|
| client/src/assets/images/
|
*/

const imageDirectory =
  path.resolve(
    __dirname,
    '../../../client/src/assets/images'
  )


const migrateImages =
  async () => {
    let connection


    try {
      connection =
        await pool.getConnection()


      await connection.beginTransaction()


      console.log(
        'Starting category image migration to MySQL...'
      )


      for (
        const [
          categorySlug,
          fileName,
        ]
        of Object.entries(
          categoryImageFiles
        )
      ) {
        const filePath =
          path.join(
            imageDirectory,
            fileName
          )


        /*
        |--------------------------------------------------------------------------
        | Read Actual Image Bytes
        |--------------------------------------------------------------------------
        */

        const imageBuffer =
          await fs.readFile(
            filePath
          )


        const mimeType =
          getMimeType(
            fileName
          )


        /*
        |--------------------------------------------------------------------------
        | Store Image Inside MySQL
        |--------------------------------------------------------------------------
        |
        | The same current category image is being used for both hero
        | and collection images.
        |
        */

        const [result] =
          await connection.execute(
            `
            UPDATE categories

            SET
              hero_image_blob = ?,
              hero_image_mime = ?,
              hero_image_name = ?,

              collection_image_blob = ?,
              collection_image_mime = ?,
              collection_image_name = ?

            WHERE slug = ?
            `,
            [
              imageBuffer,
              mimeType,
              fileName,

              imageBuffer,
              mimeType,
              fileName,

              categorySlug,
            ]
          )


        if (
          result.affectedRows === 0
        ) {
          throw new Error(
            `Category not found in MySQL: ${categorySlug}`
          )
        }


        console.log(
          `✓ ${categorySlug} → ${fileName}`
        )

        console.log(
          `  ${(imageBuffer.length / 1024).toFixed(2)} KB`
        )
      }


      await connection.commit()


      console.log(
        '\nCategory images successfully stored inside MySQL.'
      )

    } catch (error) {

      if (connection) {
        await connection.rollback()
      }


      console.error(
        '\nImage migration failed:'
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


migrateImages()