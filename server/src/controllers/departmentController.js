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
 *| GET Department Cards
 *|--------------------------------------------------------------------------
 */

export const getDepartments =
  async (
    req,
    res,
    next
  ) => {

    try {

      const [rows] =
        await pool.execute(`
          SELECT
            id,
            department_order,
            department_number,
            title,
            description,
            updated_at,

            image_blob IS NOT NULL
              AS has_image

          FROM homepage_departments

          ORDER BY
            department_order ASC
        `)


      const baseUrl =
        getBaseUrl(req)


      const departments =
        rows.map(
          (row) => ({
            id:
              row.id,

            order:
              row.department_order,

            number:
              row.department_number,

            title:
              row.title,

            description:
              row.description,

            image: {
              available:
                Boolean(
                  row.has_image
                ),

              url:
                row.has_image
                  ? `${baseUrl}/api/departments/${row.id}/image?v=${getMediaVersion(
                      row.updated_at
                    )}`
                  : null,
            },
          })
        )


      res.status(200).json({
        success: true,

        count:
          departments.length,

        departments,
      })

    } catch (error) {
      next(error)
    }
  }


/**
 *|--------------------------------------------------------------------------
 *| GET Department Image
 *|--------------------------------------------------------------------------
 */

export const getDepartmentImage =
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
          'Invalid department ID.'
        )

      }


      const [rows] =
        await pool.execute(
          `
          SELECT
            image_blob,
            image_mime,
            image_name

          FROM homepage_departments

          WHERE id = ?

          LIMIT 1
          `,
          [
            id,
          ]
        )


      if (
        rows.length === 0 ||
        !rows[0].image_blob
      ) {

        res.status(404)

        throw new Error(
          'Department image not found.'
        )

      }


      const image =
        rows[0]


      res.set({
        'Content-Type':
          image.image_mime ||
          'application/octet-stream',

        'Content-Length':
          image.image_blob.length,

        'Content-Disposition':
          `inline; filename="${image.image_name || 'department-image'}"`,

        'Cache-Control':
          'public, max-age=604800, immutable',
      })


      res.send(
        image.image_blob
      )

    } catch (error) {
      next(error)
    }
  }