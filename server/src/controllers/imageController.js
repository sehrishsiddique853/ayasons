import 'dotenv/config'

import pool from '../config/mysql.js'

import {
  optimizeImage,
  IMAGE_PRESETS,
} from '../utils/imageOptimizer.js'


const dryRun =
  process.argv.includes(
    '--dry-run'
  )


const isImageMime = (mime) =>
  [
    'image/jpeg',
    'image/png',
    'image/webp',
  ].includes(mime)


/**
 * |--------------------------------------------------------------------------
 * | Optimize One Stored Image
 * |--------------------------------------------------------------------------
 */

const optimizeStoredImage = async ({
  buffer,
  mime,
  name,
  preset,
}) => {

  if (
    !buffer ||
    !isImageMime(mime)
  ) {
    return null
  }


  /**
   * |--------------------------------------------------------------------------
   * | Skip New WebP Uploads
   * |--------------------------------------------------------------------------
   *
   * Images uploaded after our Sharp changes
   * are already WebP, so don't recompress them.
   */

  if (mime === 'image/webp') {
    return null
  }


  return optimizeImage(
    {
      buffer,
      mimetype: mime,
      originalname:
        name || 'image',
    },
    preset
  )
}


/**
 * |--------------------------------------------------------------------------
 * | Products
 * |--------------------------------------------------------------------------
 */

const optimizeProducts = async (
  connection
) => {

  console.log(
    '\nOptimizing product images...'
  )


  const [rows] =
    await connection.execute(`
      SELECT
        id,
        image_blob,
        image_mime,
        image_name

      FROM products

      WHERE image_blob IS NOT NULL
    `)


  for (const row of rows) {

    const optimized =
      await optimizeStoredImage({
        buffer:
          row.image_blob,

        mime:
          row.image_mime,

        name:
          row.image_name,

        preset:
          IMAGE_PRESETS.product,
      })


    if (!optimized) {
      continue
    }


    if (!dryRun) {

      await connection.execute(
        `
          UPDATE products

          SET
            image_blob = ?,
            image_mime = ?,
            image_name = ?

          WHERE id = ?
        `,
        [
          optimized.buffer,
          optimized.mimeType,
          optimized.fileName,
          row.id,
        ]
      )

    }


    console.log(
      `Product ${row.id}: ${
        (
          optimized.originalSize /
          1024
        ).toFixed(2)
      } KB → ${
        (
          optimized.optimizedSize /
          1024
        ).toFixed(2)
      } KB`
    )

  }

}


/**
 * |--------------------------------------------------------------------------
 * | Categories
 * |--------------------------------------------------------------------------
 */

const optimizeCategories = async (
  connection
) => {

  console.log(
    '\nOptimizing category images...'
  )


  const [rows] =
    await connection.execute(`
      SELECT
        id,

        hero_image_blob,
        hero_image_mime,
        hero_image_name,

        collection_image_blob,
        collection_image_mime,
        collection_image_name

      FROM categories
    `)


  for (const row of rows) {

    const hero =
      await optimizeStoredImage({
        buffer:
          row.hero_image_blob,

        mime:
          row.hero_image_mime,

        name:
          row.hero_image_name,

        preset:
          IMAGE_PRESETS.categoryHero,
      })


    if (hero) {

      if (!dryRun) {

        await connection.execute(
          `
            UPDATE categories

            SET
              hero_image_blob = ?,
              hero_image_mime = ?,
              hero_image_name = ?

            WHERE id = ?
          `,
          [
            hero.buffer,
            hero.mimeType,
            hero.fileName,
            row.id,
          ]
        )

      }


      console.log(
        `Category ${row.id} hero: ${
          (
            hero.originalSize /
            1024
          ).toFixed(2)
        } KB → ${
          (
            hero.optimizedSize /
            1024
          ).toFixed(2)
        } KB`
      )

    }


    const collection =
      await optimizeStoredImage({
        buffer:
          row.collection_image_blob,

        mime:
          row.collection_image_mime,

        name:
          row.collection_image_name,

        preset:
          IMAGE_PRESETS.categoryCollection,
      })


    if (collection) {

      if (!dryRun) {

        await connection.execute(
          `
            UPDATE categories

            SET
              collection_image_blob = ?,
              collection_image_mime = ?,
              collection_image_name = ?

            WHERE id = ?
          `,
          [
            collection.buffer,
            collection.mimeType,
            collection.fileName,
            row.id,
          ]
        )

      }


      console.log(
        `Category ${row.id} collection: ${
          (
            collection.originalSize /
            1024
          ).toFixed(2)
        } KB → ${
          (
            collection.optimizedSize /
            1024
          ).toFixed(2)
        } KB`
      )

    }

  }

}


/**
 * |--------------------------------------------------------------------------
 * | Departments
 * |--------------------------------------------------------------------------
 */

const optimizeDepartments = async (
  connection
) => {

  console.log(
    '\nOptimizing department images...'
  )


  const [rows] =
    await connection.execute(`
      SELECT
        id,
        image_blob,
        image_mime,
        image_name

      FROM homepage_departments

      WHERE image_blob IS NOT NULL
    `)


  for (const row of rows) {

    const optimized =
      await optimizeStoredImage({
        buffer:
          row.image_blob,

        mime:
          row.image_mime,

        name:
          row.image_name,

        preset:
          IMAGE_PRESETS.department,
      })


    if (!optimized) {
      continue
    }


    if (!dryRun) {

      await connection.execute(
        `
          UPDATE homepage_departments

          SET
            image_blob = ?,
            image_mime = ?,
            image_name = ?

          WHERE id = ?
        `,
        [
          optimized.buffer,
          optimized.mimeType,
          optimized.fileName,
          row.id,
        ]
      )

    }


    console.log(
      `Department ${row.id}: ${
        (
          optimized.originalSize /
          1024
        ).toFixed(2)
      } KB → ${
        (
          optimized.optimizedSize /
          1024
        ).toFixed(2)
      } KB`
    )

  }

}


/**
 * |--------------------------------------------------------------------------
 * | Process Images
 * |--------------------------------------------------------------------------
 */

const optimizeProcessImages = async (
  connection
) => {

  console.log(
    '\nOptimizing process images...'
  )


  const [rows] =
    await connection.execute(`
      SELECT
        id,
        image_blob,
        image_mime,
        image_name

      FROM homepage_process_steps

      WHERE image_blob IS NOT NULL
    `)


  for (const row of rows) {

    const optimized =
      await optimizeStoredImage({
        buffer:
          row.image_blob,

        mime:
          row.image_mime,

        name:
          row.image_name,

        preset:
          IMAGE_PRESETS.process,
      })


    if (!optimized) {
      continue
    }


    if (!dryRun) {

      await connection.execute(
        `
          UPDATE homepage_process_steps

          SET
            image_blob = ?,
            image_mime = ?,
            image_name = ?

          WHERE id = ?
        `,
        [
          optimized.buffer,
          optimized.mimeType,
          optimized.fileName,
          row.id,
        ]
      )

    }


    console.log(
      `Process ${row.id}: ${
        (
          optimized.originalSize /
          1024
        ).toFixed(2)
      } KB → ${
        (
          optimized.optimizedSize /
          1024
        ).toFixed(2)
      } KB`
    )

  }

}


/**
 * |--------------------------------------------------------------------------
 * | Homepage About Image
 * |--------------------------------------------------------------------------
 */

const optimizeAboutImage = async (
  connection
) => {

  console.log(
    '\nOptimizing About image...'
  )


  const [rows] =
    await connection.execute(`
      SELECT
        about_image_blob,
        about_image_mime,
        about_image_name

      FROM homepage_content

      WHERE id = 1

      LIMIT 1
    `)


  if (!rows.length) {
    return
  }


  const row =
    rows[0]


  const optimized =
    await optimizeStoredImage({
      buffer:
        row.about_image_blob,

      mime:
        row.about_image_mime,

      name:
        row.about_image_name,

      preset:
        IMAGE_PRESETS.homepageAbout,
    })


  if (!optimized) {
    return
  }


  if (!dryRun) {

    await connection.execute(
      `
        UPDATE homepage_content

        SET
          about_image_blob = ?,
          about_image_mime = ?,
          about_image_name = ?

        WHERE id = 1
      `,
      [
        optimized.buffer,
        optimized.mimeType,
        optimized.fileName,
      ]
    )

  }


  console.log(
    `Homepage About: ${
      (
        optimized.originalSize /
        1024
      ).toFixed(2)
    } KB → ${
      (
        optimized.optimizedSize /
        1024
      ).toFixed(2)
    } KB`
  )

}


/**
 * |--------------------------------------------------------------------------
 * | Standards / Certifications
 * |--------------------------------------------------------------------------
 */

const optimizeStandards = async (
  connection
) => {

  console.log(
    '\nOptimizing certification images...'
  )


  const [rows] =
    await connection.execute(`
      SELECT
        id,

        logo_image_blob,
        logo_image_mime,
        logo_image_name,

        certificate_blob,
        certificate_mime,
        certificate_name

      FROM homepage_standards
    `)


  for (const row of rows) {

    /**
     * |--------------------------------------------------------------------------
     * | Logo
     * |--------------------------------------------------------------------------
     */

    const logo =
      await optimizeStoredImage({
        buffer:
          row.logo_image_blob,

        mime:
          row.logo_image_mime,

        name:
          row.logo_image_name,

        preset:
          IMAGE_PRESETS.certificationLogo,
      })


    if (logo) {

      if (!dryRun) {

        await connection.execute(
          `
            UPDATE homepage_standards

            SET
              logo_image_blob = ?,
              logo_image_mime = ?,
              logo_image_name = ?

            WHERE id = ?
          `,
          [
            logo.buffer,
            logo.mimeType,
            logo.fileName,
            row.id,
          ]
        )

      }


      console.log(
        `Certification ${row.id} logo: ${
          (
            logo.originalSize /
            1024
          ).toFixed(2)
        } KB → ${
          (
            logo.optimizedSize /
            1024
          ).toFixed(2)
        } KB`
      )

    }


    /**
     * |--------------------------------------------------------------------------
     * | Certificate
     * |--------------------------------------------------------------------------
     *
     * PDF certificates are automatically
     * ignored because isImageMime() returns false.
     */

    const certificate =
      await optimizeStoredImage({
        buffer:
          row.certificate_blob,

        mime:
          row.certificate_mime,

        name:
          row.certificate_name,

        preset:
          IMAGE_PRESETS.certificateImage,
      })


    if (certificate) {

      if (!dryRun) {

        await connection.execute(
          `
            UPDATE homepage_standards

            SET
              certificate_blob = ?,
              certificate_mime = ?,
              certificate_name = ?

            WHERE id = ?
          `,
          [
            certificate.buffer,
            certificate.mimeType,
            certificate.fileName,
            row.id,
          ]
        )

      }


      console.log(
        `Certification ${row.id} certificate: ${
          (
            certificate.originalSize /
            1024
          ).toFixed(2)
        } KB → ${
          (
            certificate.optimizedSize /
            1024
          ).toFixed(2)
        } KB`
      )

    }

  }

}


/**
 * |--------------------------------------------------------------------------
 * | Run Migration
 * |--------------------------------------------------------------------------
 */

const run = async () => {

  let connection


  try {

    console.log(
      dryRun
        ? 'Starting existing image optimization — DRY RUN. Database will NOT be changed.'
        : 'Starting existing image optimization — LIVE MODE.'
    )


    connection =
      await pool.getConnection()


    /*
    |--------------------------------------------------------------------------
    | Start Transaction In Live Mode
    |--------------------------------------------------------------------------
    */

    if (!dryRun) {
      await connection.beginTransaction()
    }


    await optimizeProducts(
      connection
    )


    await optimizeCategories(
      connection
    )


    await optimizeDepartments(
      connection
    )


    await optimizeProcessImages(
      connection
    )


    await optimizeAboutImage(
      connection
    )


    await optimizeStandards(
      connection
    )


    /*
    |--------------------------------------------------------------------------
    | Commit Only After Everything Succeeds
    |--------------------------------------------------------------------------
    */

    if (!dryRun) {
      await connection.commit()
    }


    console.log(
      dryRun
        ? '\nDry run completed successfully. Database was NOT changed.'
        : '\nExisting image optimization completed successfully.'
    )

  } catch (error) {

    /*
    |--------------------------------------------------------------------------
    | Roll Back Live Migration On Failure
    |--------------------------------------------------------------------------
    */

    if (
      connection &&
      !dryRun
    ) {
      await connection
        .rollback()
        .catch(() => {})
    }


    console.error(
      '\nExisting image optimization failed:',
      error
    )


    process.exitCode = 1

  } finally {

    if (connection) {
      connection.release()
    }


    await pool.end()

  }

}


run()