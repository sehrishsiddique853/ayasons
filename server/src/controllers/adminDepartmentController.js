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
 * | GET All Departments For Admin
 * |--------------------------------------------------------------------------
 */

export const getAdminDepartments =
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

            image_blob IS NOT NULL
              AS has_image,

            image_name

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

              name:
                row.image_name ||
                '',

              url:
                row.has_image
                  ? `${baseUrl}/api/departments/${row.id}/image`
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
 * |--------------------------------------------------------------------------
 * | PUT Department Details
 * |--------------------------------------------------------------------------
 */

export const updateAdminDepartment =
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

      const {
        number,
        title,
        description,
      } = req.body

      if (
        !number?.trim() ||
        !title?.trim() ||
        !description?.trim()
      ) {
        res.status(400)

        throw new Error(
          'Department number, title and description are required.'
        )
      }

      const [result] =
        await pool.execute(
          `
          UPDATE homepage_departments

          SET
            department_number = ?,
            title = ?,
            description = ?

          WHERE id = ?
          `,
          [
            number.trim(),
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
          'Department not found.'
        )
      }

      res.status(200).json({
        success: true,

        message:
          'Department updated successfully.',
      })
    } catch (error) {
      next(error)
    }
  }


/**
 * |--------------------------------------------------------------------------
 * | PUT Department Image
 * |--------------------------------------------------------------------------
 */

export const updateAdminDepartmentImage =
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

      if (!req.file) {
        res.status(400)

        throw new Error(
          'Department image is required.'
        )
      }


      /*
      |--------------------------------------------------------------------------
      | Optimize Department Image
      |--------------------------------------------------------------------------
      */

      const optimizedImage =
        await optimizeImage(
          req.file,
          IMAGE_PRESETS.department
        )


      console.log(
        `Department image optimized: ${
          (
            optimizedImage.originalSize /
            1024
          ).toFixed(2)
        } KB → ${
          (
            optimizedImage.optimizedSize /
            1024
          ).toFixed(2)
        } KB`
      )


      /*
      |--------------------------------------------------------------------------
      | Store Optimized Image In MySQL
      |--------------------------------------------------------------------------
      */

      const [result] =
        await pool.execute(
          `
          UPDATE homepage_departments

          SET
            image_blob = ?,
            image_mime = ?,
            image_name = ?

          WHERE id = ?
          `,
          [
            optimizedImage.buffer,
            optimizedImage.mimeType,
            optimizedImage.fileName,
            id,
          ]
        )


      if (
        result.affectedRows === 0
      ) {
        res.status(404)

        throw new Error(
          'Department not found.'
        )
      }


      res.status(200).json({
        success: true,

        message:
          'Department image updated successfully.',

        image: {
          available: true,

          name:
            optimizedImage.fileName,

          url:
            `${getBaseUrl(req)}/api/departments/${id}/image`,
        },
      })
    } catch (error) {
      next(error)
    }
  }