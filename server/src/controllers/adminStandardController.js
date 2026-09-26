import pool from '../config/mysql.js'

import {
  optimizeImage,
  IMAGE_PRESETS,
} from '../utils/imageOptimizer.js'


const getBaseUrl = (req) => {
  const configured =
    process.env.SERVER_URL
      ?.trim()
      ?.replace(/\/+$/, '')

  return (
    configured ||
    `${req.protocol}://${req.get('host')}`
  )
}


/**
 * |--------------------------------------------------------------------------
 * | GET Admin Standards
 * |--------------------------------------------------------------------------
 */

export const getAdminStandards =
  async (
    req,
    res,
    next
  ) => {

    try {

      const [contentRows] =
        await pool.execute(`
          SELECT
            kicker,
            heading,
            footer_text

          FROM homepage_standards_content

          WHERE id = 1

          LIMIT 1
        `)


      const [rows] =
        await pool.execute(`
          SELECT
            id,
            display_order,
            title,
            description,

            logo_image_blob IS NOT NULL
              AS has_logo,

            logo_image_name,

            certificate_blob IS NOT NULL
              AS has_certificate,

            certificate_name,
            certificate_mime

          FROM homepage_standards

          ORDER BY
            display_order ASC,
            id ASC
        `)


      const baseUrl =
        getBaseUrl(req)


      const content =
        contentRows[0] || {}


      res.status(200).json({
        success: true,

        content: {
          kicker:
            content.kicker ||
            '',

          heading:
            content.heading ||
            '',

          footerText:
            content.footer_text ||
            '',
        },

        standards:
          rows.map(
            (row) => ({

              id:
                row.id,

              order:
                row.display_order,

              title:
                row.title,

              description:
                row.description,

              logo: {
                available:
                  Boolean(
                    row.has_logo
                  ),

                name:
                  row.logo_image_name ||
                  '',

                url:
                  row.has_logo
                    ? `${baseUrl}/api/standards/${row.id}/logo`
                    : null,
              },

              certificate: {
                available:
                  Boolean(
                    row.has_certificate
                  ),

                name:
                  row.certificate_name ||
                  '',

                mime:
                  row.certificate_mime ||
                  '',

                url:
                  row.has_certificate
                    ? `${baseUrl}/api/standards/${row.id}/certificate`
                    : null,
              },

            })
          ),
      })

    } catch (error) {
      next(error)
    }
  }


/**
 * |--------------------------------------------------------------------------
 * | UPDATE Section Heading
 * |--------------------------------------------------------------------------
 */

export const updateAdminStandardsContent =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        kicker,
        heading,
        footerText,
      } = req.body


      if (
        !kicker?.trim() ||
        !heading?.trim()
      ) {

        res.status(400)

        throw new Error(
          'Certification heading fields are required.'
        )

      }


      await pool.execute(
        `
          UPDATE homepage_standards_content

          SET
            kicker = ?,
            heading = ?,
            footer_text = ?

          WHERE id = 1
        `,
        [
          kicker.trim(),
          heading.trim(),
          footerText?.trim() ||
            '',
        ]
      )


      res.status(200).json({
        success: true,

        message:
          'Certification section content updated successfully.',
      })

    } catch (error) {
      next(error)
    }
  }


/**
 * |--------------------------------------------------------------------------
 * | CREATE Card
 * |--------------------------------------------------------------------------
 */

export const createAdminStandard =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        title,
        description,
      } = req.body


      if (
        !title?.trim() ||
        !description?.trim()
      ) {

        res.status(400)

        throw new Error(
          'Certification title and description are required.'
        )

      }


      const [orderRows] =
        await pool.execute(`
          SELECT
            COALESCE(
              MAX(display_order),
              0
            ) AS max_order

          FROM homepage_standards
        `)


      const nextOrder =
        Number(
          orderRows[0]
            .max_order
        ) + 1


      const [result] =
        await pool.execute(
          `
            INSERT INTO homepage_standards (
              display_order,
              title,
              description
            )

            VALUES (?, ?, ?)
          `,
          [
            nextOrder,
            title.trim(),
            description.trim(),
          ]
        )


      res.status(201).json({
        success: true,

        message:
          'Certification card created successfully.',

        standard: {
          id:
            result.insertId,

          order:
            nextOrder,

          title:
            title.trim(),

          description:
            description.trim(),

          logo: {
            available: false,
            name: '',
            url: null,
          },

          certificate: {
            available: false,
            name: '',
            mime: '',
            url: null,
          },
        },
      })

    } catch (error) {
      next(error)
    }
  }


/**
 * |--------------------------------------------------------------------------
 * | UPDATE Card
 * |--------------------------------------------------------------------------
 */

export const updateAdminStandard =
  async (
    req,
    res,
    next
  ) => {

    try {

      const id =
        Number(
          req.params.id
        )


      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {

        res.status(400)

        throw new Error(
          'Invalid certification ID.'
        )

      }


      const {
        title,
        description,
      } = req.body


      if (
        !title?.trim() ||
        !description?.trim()
      ) {

        res.status(400)

        throw new Error(
          'Certification title and description are required.'
        )

      }


      const [result] =
        await pool.execute(
          `
            UPDATE homepage_standards

            SET
              title = ?,
              description = ?

            WHERE id = ?
          `,
          [
            title.trim(),
            description.trim(),
            id,
          ]
        )


      if (
        result.affectedRows === 0
      ) {

        res.status(404)

        throw new Error(
          'Certification card not found.'
        )

      }


      res.status(200).json({
        success: true,

        message:
          'Certification card updated successfully.',
      })

    } catch (error) {
      next(error)
    }
  }


/**
 * |--------------------------------------------------------------------------
 * | UPDATE Logo
 * |--------------------------------------------------------------------------
 */

export const updateAdminStandardLogo =
  async (
    req,
    res,
    next
  ) => {

    try {

      const id =
        Number(
          req.params.id
        )


      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {

        res.status(400)

        throw new Error(
          'Invalid certification ID.'
        )

      }


      if (!req.file) {

        res.status(400)

        throw new Error(
          'Logo image is required.'
        )

      }


      /*
      |--------------------------------------------------------------------------
      | Optimize Certification Logo
      |--------------------------------------------------------------------------
      */

      const optimizedLogo =
        await optimizeImage(
          req.file,
          IMAGE_PRESETS.certificationLogo
        )


      console.log(
        `Certification logo optimized: ${
          (
            optimizedLogo.originalSize /
            1024
          ).toFixed(2)
        } KB → ${
          (
            optimizedLogo.optimizedSize /
            1024
          ).toFixed(2)
        } KB`
      )


      const [result] =
        await pool.execute(
          `
            UPDATE homepage_standards

            SET
              logo_image_blob = ?,
              logo_image_mime = ?,
              logo_image_name = ?

            WHERE id = ?
          `,
          [
            optimizedLogo.buffer,
            optimizedLogo.mimeType,
            optimizedLogo.fileName,
            id,
          ]
        )


      if (
        result.affectedRows === 0
      ) {

        res.status(404)

        throw new Error(
          'Certification card not found.'
        )

      }


      res.status(200).json({
        success: true,

        message:
          'Certification logo updated successfully.',

        logo: {
          available: true,

          name:
            optimizedLogo.fileName,

          url:
            `${getBaseUrl(req)}/api/standards/${id}/logo`,
        },
      })

    } catch (error) {
      next(error)
    }
  }


/**
 * |--------------------------------------------------------------------------
 * | UPDATE Certificate File
 * |--------------------------------------------------------------------------
 */

export const updateAdminStandardCertificate =
  async (
    req,
    res,
    next
  ) => {

    try {

      const id =
        Number(
          req.params.id
        )


      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {

        res.status(400)

        throw new Error(
          'Invalid certification ID.'
        )

      }


      if (!req.file) {

        res.status(400)

        throw new Error(
          'Certificate file is required.'
        )

      }


      /*
      |--------------------------------------------------------------------------
      | Prepare Certificate File
      |--------------------------------------------------------------------------
      |
      | PDFs stay untouched.
      |
      | Image certificates are optimized
      | and converted to WebP.
      |
      */

      let certificateFile = {
        buffer:
          req.file.buffer,

        mimeType:
          req.file.mimetype,

        fileName:
          req.file.originalname,
      }


      if (
        req.file.mimetype !==
        'application/pdf'
      ) {

        const optimizedCertificate =
          await optimizeImage(
            req.file,
            IMAGE_PRESETS.certificateImage
          )


        certificateFile = {
          buffer:
            optimizedCertificate.buffer,

          mimeType:
            optimizedCertificate.mimeType,

          fileName:
            optimizedCertificate.fileName,
        }


        console.log(
          `Certificate image optimized: ${
            (
              optimizedCertificate.originalSize /
              1024
            ).toFixed(2)
          } KB → ${
            (
              optimizedCertificate.optimizedSize /
              1024
            ).toFixed(2)
          } KB`
        )

      }


      const [result] =
        await pool.execute(
          `
            UPDATE homepage_standards

            SET
              certificate_blob = ?,
              certificate_mime = ?,
              certificate_name = ?

            WHERE id = ?
          `,
          [
            certificateFile.buffer,
            certificateFile.mimeType,
            certificateFile.fileName,
            id,
          ]
        )


      if (
        result.affectedRows === 0
      ) {

        res.status(404)

        throw new Error(
          'Certification card not found.'
        )

      }


      res.status(200).json({
        success: true,

        message:
          'Certificate uploaded successfully.',

        certificate: {
          available: true,

          name:
            certificateFile.fileName,

          mime:
            certificateFile.mimeType,

          url:
            `${getBaseUrl(req)}/api/standards/${id}/certificate`,
        },
      })

    } catch (error) {
      next(error)
    }
  }


/**
 * |--------------------------------------------------------------------------
 * | DELETE Card
 * |--------------------------------------------------------------------------
 */

export const deleteAdminStandard =
  async (
    req,
    res,
    next
  ) => {

    let connection


    try {

      const id =
        Number(
          req.params.id
        )


      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {

        res.status(400)

        throw new Error(
          'Invalid certification ID.'
        )

      }


      connection =
        await pool.getConnection()


      await connection
        .beginTransaction()


      const [result] =
        await connection.execute(
          `
            DELETE FROM homepage_standards

            WHERE id = ?
          `,
          [
            id,
          ]
        )


      if (
        result.affectedRows === 0
      ) {

        res.status(404)

        throw new Error(
          'Certification card not found.'
        )

      }


      const [remaining] =
        await connection.execute(`
          SELECT id

          FROM homepage_standards

          ORDER BY
            display_order ASC,
            id ASC
        `)


      for (
        let index = 0;
        index <
          remaining.length;
        index += 1
      ) {

        await connection.execute(
          `
            UPDATE homepage_standards

            SET display_order = ?

            WHERE id = ?
          `,
          [
            index + 1,
            remaining[index].id,
          ]
        )

      }


      await connection.commit()


      res.status(200).json({
        success: true,

        message:
          'Certification card deleted successfully.',
      })

    } catch (error) {

      if (connection) {

        await connection
          .rollback()
          .catch(() => {})

      }


      next(error)

    } finally {

      if (connection) {
        connection.release()
      }

    }
  }