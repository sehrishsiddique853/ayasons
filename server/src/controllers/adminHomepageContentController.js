import pool from '../config/mysql.js'

const getBaseUrl = (
  req
) => {

  const configured =
    process.env.SERVER_URL
      ?.trim()
      ?.replace(/\/+$/, '')


  return (
    configured ||
    `${req.protocol}://${req.get('host')}`
  )
}


const parseStats = (
  value,
  expectedLength,
  label
) => {

  let parsed


  try {

    parsed =
      typeof value ===
      'string'
        ? JSON.parse(value)
        : value

  } catch {

    throw new Error(
      `${label} are invalid.`
    )

  }


  if (
    !Array.isArray(
      parsed
    ) ||
    parsed.length !==
      expectedLength
  ) {

    throw new Error(
      `${label} must contain exactly ${expectedLength} items.`
    )

  }


  return parsed.map(
    (
      item,
      index
    ) => {

      const statValue =
        String(
          item?.value ??
          ''
        ).trim()


      const statLabel =
        String(
          item?.label ??
          ''
        ).trim()


      if (
        !statValue ||
        !statLabel
      ) {

        throw new Error(
          `${label} item ${index + 1} requires a value and label.`
        )

      }


      return {
        value:
          statValue,

        label:
          statLabel,
      }

    }
  )
}


/*
|--------------------------------------------------------------------------
| GET Admin Homepage Content
|--------------------------------------------------------------------------
*/

export const getAdminHomepageContent =
  async (
    req,
    res,
    next
  ) => {

    try {

      const [rows] =
        await pool.execute(`
          SELECT
            manufacturing_stats_json,
            department_stats_json,

            about_image_blob IS NOT NULL
              AS has_about_image,

            about_image_name,

            manufacturing_video_blob IS NOT NULL
              AS has_manufacturing_video,

            manufacturing_video_name

          FROM homepage_content

          WHERE id = 1

          LIMIT 1
        `)


      if (
        rows.length === 0
      ) {

        res.status(404)

        throw new Error(
          'Homepage content not found.'
        )

      }


      const row =
        rows[0]


      res.status(200).json({
        success: true,

        content: {

          manufacturingStats:
            typeof row
              .manufacturing_stats_json ===
            'string'
              ? JSON.parse(
                  row
                    .manufacturing_stats_json
                )
              : row
                  .manufacturing_stats_json,


          departmentStats:
            typeof row
              .department_stats_json ===
            'string'
              ? JSON.parse(
                  row
                    .department_stats_json
                )
              : row
                  .department_stats_json,


          aboutImage: {
            available:
              Boolean(
                row.has_about_image
              ),

            name:
              row.about_image_name ||
              '',
          },


          manufacturingVideo: {
            available:
              Boolean(
                row.has_manufacturing_video
              ),

            name:
              row.manufacturing_video_name ||
              '',
          },
        },
      })

    } catch (error) {
      next(error)
    }
  }


/*
|--------------------------------------------------------------------------
| PUT Admin Homepage Content
|--------------------------------------------------------------------------
*/

export const updateAdminHomepageContent =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        manufacturingStats,
        departmentStats,
      } = req.body


      const parsedManufacturingStats =
        parseStats(
          manufacturingStats,
          3,
          'Manufacturing statistics'
        )


      const parsedDepartmentStats =
        parseStats(
          departmentStats,
          4,
          'Department statistics'
        )


      const aboutImage =
        req.files
          ?.aboutImage
          ?.[0]


      const manufacturingVideo =
        req.files
          ?.manufacturingVideo
          ?.[0]


      /*
      |--------------------------------------------------------------------------
      | About Image Validation
      |--------------------------------------------------------------------------
      */

      if (
        aboutImage &&
        aboutImage.size >
          5 * 1024 * 1024
      ) {

        res.status(413)

        throw new Error(
          'About image must be 5 MB or smaller.'
        )

      }


      /*
      |--------------------------------------------------------------------------
      | Video Validation
      |--------------------------------------------------------------------------
      */

      if (
        manufacturingVideo &&
        ![
          'video/mp4',
          'video/webm',
        ].includes(
          manufacturingVideo
            .mimetype
        )
      ) {

        res.status(415)

        throw new Error(
          'Manufacturing video must be MP4 or WEBM.'
        )

      }


      const fields = [
        'manufacturing_stats_json = ?',
        'department_stats_json = ?',
      ]


      const params = [
        JSON.stringify(
          parsedManufacturingStats
        ),

        JSON.stringify(
          parsedDepartmentStats
        ),
      ]


      /*
      |--------------------------------------------------------------------------
      | Optional New About Image
      |--------------------------------------------------------------------------
      */

      if (aboutImage) {

        fields.push(
          'about_image_blob = ?',
          'about_image_mime = ?',
          'about_image_name = ?'
        )


        params.push(
          aboutImage.buffer,
          aboutImage.mimetype,
          aboutImage.originalname
        )

      }


      /*
      |--------------------------------------------------------------------------
      | Optional New Video
      |--------------------------------------------------------------------------
      */

      if (
        manufacturingVideo
      ) {

        fields.push(
          'manufacturing_video_blob = ?',
          'manufacturing_video_mime = ?',
          'manufacturing_video_name = ?'
        )


        params.push(
          manufacturingVideo.buffer,
          manufacturingVideo.mimetype,
          manufacturingVideo.originalname
        )

      }


      params.push(
        1
      )


      const [result] =
        await pool.execute(
          `
          UPDATE homepage_content

          SET
            ${fields.join(', ')}

          WHERE id = ?
          `,
          params
        )


      if (
        result.affectedRows === 0
      ) {

        res.status(404)

        throw new Error(
          'Homepage content not found.'
        )

      }


      res.status(200).json({
        success: true,

        message:
          'Homepage content updated successfully.',
      })

    } catch (error) {
      next(error)
    }
  }


  /*
|--------------------------------------------------------------------------
| GET Process Section
|--------------------------------------------------------------------------
*/

export const getAdminProcessContent =
  async (
    req,
    res,
    next
  ) => {

    try {

      const [contentRows] =
        await pool.execute(`
          SELECT
            process_kicker,
            process_heading_line_1,
            process_heading_line_2,
            process_intro

          FROM homepage_content

          WHERE id = 1

          LIMIT 1
        `)


      if (
        contentRows.length === 0
      ) {

        res.status(404)

        throw new Error(
          'Homepage content not found.'
        )

      }


      const [stepRows] =
        await pool.execute(`
          SELECT
            id,
            step_order,
            step_number,
            title,
            description,

            image_blob IS NOT NULL
              AS has_image,

            image_name

          FROM homepage_process_steps

          ORDER BY
            step_order ASC
        `)


      const content =
        contentRows[0]


      res.status(200).json({
        success: true,

        process: {

          kicker:
            content.process_kicker ||
            '',

          headingLine1:
            content.process_heading_line_1 ||
            '',

          headingLine2:
            content.process_heading_line_2 ||
            '',

          intro:
            content.process_intro ||
            '',

          steps:
            stepRows.map(
              (step) => ({

                id:
                  step.id,

                order:
                  step.step_order,

                number:
                  step.step_number,

                title:
                  step.title,

                description:
                  step.description,

                image: {

                  available:
                    Boolean(
                      step.has_image
                    ),

                  name:
                    step.image_name ||
                    '',

                  url:
                    step.has_image
                      ? `${getBaseUrl(req)}/api/home-content/process/${step.id}/image`
                      : null,
                },

              })
            ),
        },
      })

    } catch (error) {
      next(error)
    }
  }


  /*
|--------------------------------------------------------------------------
| PUT Process Content
|--------------------------------------------------------------------------
*/

export const updateAdminProcessContent =
  async (
    req,
    res,
    next
  ) => {

    let connection


    try {

      const {
        kicker,
        headingLine1,
        headingLine2,
        intro,
        steps,
      } = req.body


      if (
        !kicker?.trim() ||
        !headingLine1?.trim() ||
        !headingLine2?.trim() ||
        !intro?.trim()
      ) {

        res.status(400)

        throw new Error(
          'Process section heading fields are required.'
        )

      }


      if (
        !Array.isArray(
          steps
        ) ||
        steps.length !== 7
      ) {

        res.status(400)

        throw new Error(
          'Process section must contain exactly 7 cards.'
        )

      }


      for (
        let index = 0;
        index < steps.length;
        index += 1
      ) {

        const step =
          steps[index]


        if (
          !Number.isInteger(
            Number(step.id)
          ) ||
          !step.number?.trim() ||
          !step.title?.trim() ||
          !step.description?.trim()
        ) {

          res.status(400)

          throw new Error(
            `Process card ${index + 1} is incomplete.`
          )

        }

      }


      connection =
        await pool.getConnection()


      await connection
        .beginTransaction()


      /*
      |--------------------------------------------------------------------------
      | Update Header
      |--------------------------------------------------------------------------
      */

      await connection.execute(
        `
        UPDATE homepage_content

        SET
          process_kicker = ?,
          process_heading_line_1 = ?,
          process_heading_line_2 = ?,
          process_intro = ?

        WHERE id = 1
        `,
        [
          kicker.trim(),
          headingLine1.trim(),
          headingLine2.trim(),
          intro.trim(),
        ]
      )


      /*
      |--------------------------------------------------------------------------
      | Update Cards
      |--------------------------------------------------------------------------
      */

      for (
        let index = 0;
        index < steps.length;
        index += 1
      ) {

        const step =
          steps[index]


        await connection.execute(
          `
          UPDATE homepage_process_steps

          SET
            step_order = ?,
            step_number = ?,
            title = ?,
            description = ?

          WHERE id = ?
          `,
          [
            index + 1,
            step.number.trim(),
            step.title.trim(),
            step.description.trim(),
            Number(step.id),
          ]
        )

      }


      await connection.commit()


      res.status(200).json({
        success: true,

        message:
          'Process section updated successfully.',
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

  /*
|--------------------------------------------------------------------------
| PUT Process Card Image
|--------------------------------------------------------------------------
*/

export const updateAdminProcessImage =
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
          'Invalid process step ID.'
        )

      }


      if (!req.file) {

        res.status(400)

        throw new Error(
          'Process card image is required.'
        )

      }


      if (
        req.file.size >
        5 * 1024 * 1024
      ) {

        res.status(413)

        throw new Error(
          'Process image must be 5 MB or smaller.'
        )

      }


      const [result] =
        await pool.execute(
          `
          UPDATE homepage_process_steps

          SET
            image_blob = ?,
            image_mime = ?,
            image_name = ?

          WHERE id = ?
          `,
          [
            req.file.buffer,
            req.file.mimetype,
            req.file.originalname,
            id,
          ]
        )


      if (
        result.affectedRows === 0
      ) {

        res.status(404)

        throw new Error(
          'Process card not found.'
        )

      }


      res.status(200).json({
        success: true,

        message:
          'Process card image updated successfully.',

        image: {
          url:
            `${getBaseUrl(req)}/api/home-content/process/${id}/image`,
        },
      })

    } catch (error) {
      next(error)
    }
  }