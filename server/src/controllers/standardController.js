import pool from '../config/mysql.js'


const getBaseUrl = (
  req
) => {
  return ''
}


const getMediaVersion = (
  value
) => {

  const timestamp =
    value
      ? new Date(
          value
        ).getTime()
      : NaN


  return Number.isFinite(
    timestamp
  )
    ? timestamp
    : 1
}


/**
 *|--------------------------------------------------------------------------
 *| GET Standards Section
 *|--------------------------------------------------------------------------
 */

export const getStandards =
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
            updated_at,

            logo_image_blob IS NOT NULL
              AS has_logo,

            certificate_blob IS NOT NULL
              AS has_certificate,

            certificate_mime

          FROM homepage_standards

          ORDER BY
            display_order ASC,
            id ASC
        `)


      const baseUrl =
        getBaseUrl(req)


      const content =
        contentRows[0] || {
          kicker:
            'Certifications & Compliance',

          heading:
            'Documentation Available On Request',

          footer_text:
            '',
        }


      const standards =
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

              url:
                row.has_logo
                  ? `${baseUrl}/api/standards/${row.id}/logo?v=${getMediaVersion(
                      row.updated_at
                    )}`
                  : null,
            },

            certificate: {
              available:
                Boolean(
                  row.has_certificate
                ),

              mime:
                row.certificate_mime ||
                '',

              url:
                row.has_certificate
                  ? `${baseUrl}/api/standards/${row.id}/certificate?v=${getMediaVersion(
                      row.updated_at
                    )}`
                  : null,
            },

          })
        )


      res.status(200).json({
        success: true,

        content: {
          kicker:
            content.kicker,

          heading:
            content.heading,

          footerText:
            content.footer_text ||
            '',
        },

        count:
          standards.length,

        standards,
      })

    } catch (error) {
      next(error)
    }
  }


/**
 *|--------------------------------------------------------------------------
 *| GET Logo
 *|--------------------------------------------------------------------------
 */

export const getStandardLogo =
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


      const [rows] =
        await pool.execute(
          `
          SELECT
            logo_image_blob,
            logo_image_mime,
            logo_image_name

          FROM homepage_standards

          WHERE id = ?

          LIMIT 1
          `,
          [
            id,
          ]
        )


      if (
        rows.length === 0 ||
        !rows[0]
          .logo_image_blob
      ) {

        res.status(404)

        throw new Error(
          'Certification logo not found.'
        )

      }


      const logo =
        rows[0]


      res.set({
        'Content-Type':
          logo.logo_image_mime ||
          'application/octet-stream',

        'Content-Length':
          logo
            .logo_image_blob
            .length,

        'Content-Disposition':
          `inline; filename="${logo.logo_image_name || 'certificate-logo'}"`,

        'Cache-Control':
          'public, max-age=604800, immutable',
      })


      res.send(
        logo.logo_image_blob
      )

    } catch (error) {
      next(error)
    }
  }


/**
 *|--------------------------------------------------------------------------
 *| GET Actual Certificate
 *|--------------------------------------------------------------------------
 */

export const getStandardCertificate =
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


      const [rows] =
        await pool.execute(
          `
          SELECT
            certificate_blob,
            certificate_mime,
            certificate_name

          FROM homepage_standards

          WHERE id = ?

          LIMIT 1
          `,
          [
            id,
          ]
        )


      if (
        rows.length === 0 ||
        !rows[0]
          .certificate_blob
      ) {

        res.status(404)

        throw new Error(
          'Certificate file not found.'
        )

      }


      const certificate =
        rows[0]


      res.set({
        'Content-Type':
          certificate
            .certificate_mime ||
          'application/octet-stream',

        'Content-Length':
          certificate
            .certificate_blob
            .length,

        'Content-Disposition':
          `inline; filename="${certificate.certificate_name || 'certificate'}"`,

        'Cache-Control':
          'public, max-age=604800, immutable',
      })


      res.send(
        certificate
          .certificate_blob
      )

    } catch (error) {
      next(error)
    }
  }