import pool from '../config/mysql.js'


const parseJson = (
  value,
  fallback = []
) => {

  if (!value) {
    return fallback
  }


  if (
    Array.isArray(value) ||
    typeof value === 'object'
  ) {
    return value
  }


  try {

    return JSON.parse(
      value
    )

  } catch {

    return fallback

  }
}


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
 *| GET /api/home-content
 *|--------------------------------------------------------------------------
 */

export const getHomepageContent =
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

            about_image_blob IS NOT NULL
              AS has_about_image,

            manufacturing_stats_json,

            manufacturing_video_blob IS NOT NULL
              AS has_manufacturing_video,

            manufacturing_video_name,

            department_stats_json,

            process_kicker,
            process_heading_line_1,
            process_heading_line_2,
            process_intro,

            updated_at

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


      const baseUrl =
        getBaseUrl(req)


      /**
       * |--------------------------------------------------------------------------
       * | Homepage Process Steps
       * |--------------------------------------------------------------------------
       */

      const [processRows] =
        await pool.execute(`
          SELECT
            id,
            step_order,
            step_number,
            title,
            description,
            updated_at,

            image_blob IS NOT NULL
              AS has_image

          FROM homepage_process_steps

          ORDER BY
            step_order ASC
        `)


      res.status(200).json({
        success: true,

        content: {

          aboutImage: {
            available:
              Boolean(
                row.has_about_image
              ),

            url:
              row.has_about_image
                ? `${baseUrl}/api/home-content/about-image?v=${getMediaVersion(
                    row.updated_at
                  )}`
                : null,
          },


          manufacturingStats:
            parseJson(
              row.manufacturing_stats_json,
              []
            ),


          manufacturingVideo: {
            available:
              Boolean(
                row.has_manufacturing_video
              ),

            name:
              row.manufacturing_video_name ||
              '',

            url:
              row.has_manufacturing_video
                ? `${baseUrl}/api/home-content/manufacturing-video?v=${getMediaVersion(
                    row.updated_at
                  )}`
                : null,
          },


          departmentStats:
            parseJson(
              row.department_stats_json,
              []
            ),


          /**
           * |--------------------------------------------------------------------------
           * | Process Section
           * |--------------------------------------------------------------------------
           */

          process: {

            kicker:
              row.process_kicker ||
              'Our Process',

            headingLine1:
              row.process_heading_line_1 ||
              'From Design',

            headingLine2:
              row.process_heading_line_2 ||
              'To Your Door.',

            intro:
              row.process_intro ||
              '',

            steps:
              processRows.map(
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

                    url:
                      step.has_image
                        ? `${baseUrl}/api/home-content/process/${step.id}/image?v=${getMediaVersion(
                            step.updated_at
                          )}`
                        : null,
                  },
                })
              ),
          },


          updatedAt:
            row.updated_at,
        },
      })

    } catch (error) {
      next(error)
    }
  }


/**
 *|--------------------------------------------------------------------------
 *| GET About Image
 *|--------------------------------------------------------------------------
 */

export const getHomepageAboutImage =
  async (
    req,
    res,
    next
  ) => {

    try {

      const [rows] =
        await pool.execute(`
          SELECT
            about_image_blob,
            about_image_mime,
            about_image_name

          FROM homepage_content

          WHERE id = 1

          LIMIT 1
        `)


      if (
        rows.length === 0 ||
        !rows[0]
          .about_image_blob
      ) {

        res.status(404)

        throw new Error(
          'Homepage about image not found.'
        )

      }


      const image =
        rows[0]


      res.set({
        'Content-Type':
          image.about_image_mime ||
          'application/octet-stream',

        'Content-Length':
          image
            .about_image_blob
            .length,

        'Content-Disposition':
          `inline; filename="${image.about_image_name || 'about-image'}"`,

        'Cache-Control':
          'public, max-age=604800, immutable',
      })


      res.send(
        image.about_image_blob
      )

    } catch (error) {
      next(error)
    }
  }


/**
 *|--------------------------------------------------------------------------
 *| GET Manufacturing Video
 *|--------------------------------------------------------------------------
 *|
 *| Range support is important for HTML5 <video>.
 *|
 */

export const getHomepageManufacturingVideo =
  async (
    req,
    res,
    next
  ) => {

    try {

      const [rows] =
        await pool.execute(`
          SELECT
            manufacturing_video_blob,
            manufacturing_video_mime,
            manufacturing_video_name

          FROM homepage_content

          WHERE id = 1

          LIMIT 1
        `)


      if (
        rows.length === 0 ||
        !rows[0]
          .manufacturing_video_blob
      ) {

        res.status(404)

        throw new Error(
          'Manufacturing video not found.'
        )

      }


      const video =
        rows[0]


      const buffer =
        video
          .manufacturing_video_blob


      const totalSize =
        buffer.length


      const contentType =
        video
          .manufacturing_video_mime ||
        'video/mp4'


      const range =
        req.headers.range


      /**
       * |--------------------------------------------------------------------------
       * | Full Video
       * |--------------------------------------------------------------------------
       */

      if (!range) {

        res.set({
          'Content-Type':
            contentType,

          'Content-Length':
            totalSize,

          'Accept-Ranges':
            'bytes',

          'Cache-Control':
            'public, max-age=604800, immutable',
        })


        res.send(
          buffer
        )


        return
      }


      /**
       * |--------------------------------------------------------------------------
       * | Range Request
       * |--------------------------------------------------------------------------
       */

      const parts =
        range
          .replace(
            /bytes=/,
            ''
          )
          .split('-')


      const start =
        Number(
          parts[0]
        )


      const requestedEnd =
        parts[1]
          ? Number(
              parts[1]
            )
          : totalSize - 1


      const end =
        Math.min(
          requestedEnd,
          totalSize - 1
        )


      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start < 0 ||
        start > end ||
        start >= totalSize
      ) {

        res
          .status(416)
          .set({
            'Content-Range':
              `bytes */${totalSize}`,
          })
          .end()


        return
      }


      const chunk =
        buffer.subarray(
          start,
          end + 1
        )


      res.status(206)


      res.set({
        'Content-Type':
          contentType,

        'Content-Length':
          chunk.length,

        'Content-Range':
          `bytes ${start}-${end}/${totalSize}`,

        'Accept-Ranges':
          'bytes',

        'Cache-Control':
          'public, max-age=604800, immutable',
      })


      res.send(
        chunk
      )

    } catch (error) {
      next(error)
    }
  }


/**
 *|--------------------------------------------------------------------------
 *| GET Process Image
 *|--------------------------------------------------------------------------
 */

export const getHomepageProcessImage =
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


      const [rows] =
        await pool.execute(
          `
          SELECT
            image_blob,
            image_mime,
            image_name

          FROM homepage_process_steps

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
          'Process step image not found.'
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
          `inline; filename="${image.image_name || 'process-image'}"`,

        'Cache-Control':
          'public, max-age=3600',
      })


      res.send(
        image.image_blob
      )

    } catch (error) {
      next(error)
    }
  }