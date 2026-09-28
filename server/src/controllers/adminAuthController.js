import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import pool from '../config/mysql.js'


const COOKIE_NAME =
  'ayosons_admin_token'


const getJwtSecret = () => {

  const secret =
    process.env.JWT_SECRET


  if (!secret) {

    const error =
      new Error(
        'JWT_SECRET is not configured.'
      )

    error.statusCode = 500

    throw error

  }


  return secret
}


const getCookieOptions = () => {

  const isProduction =
    process.env.NODE_ENV ===
    'production'


  const hours =
    Number(
      process.env
        .JWT_COOKIE_HOURS ||
      8
    )


  return {
    httpOnly: true,

    secure:
      isProduction,

    sameSite:
      'lax',

    maxAge:
      hours *
      60 *
      60 *
      1000,

    path: '/',
  }
}


const createAdminToken = (
  admin
) => {

  return jwt.sign(
    {
      sub:
        String(admin.id),

      email:
        admin.email,

      role:
        'admin',
    },

    getJwtSecret(),

    {
      expiresIn:
        process.env
          .JWT_EXPIRES_IN ||
        '8h',
    }
  )

}


/*
|--------------------------------------------------------------------------
| POST /api/admin/auth/login
|--------------------------------------------------------------------------
*/

export const loginAdmin =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        email,
        password,
      } = req.body


      if (
        !email?.trim() ||
        !password
      ) {

        res.status(400)

        throw new Error(
          'Email and password are required.'
        )

      }


      const normalizedEmail =
        email
          .trim()
          .toLowerCase()


      const [rows] =
        await pool.execute(
          `
            SELECT
              id,
              name,
              email,
              password_hash,
              active

            FROM admin_users

            WHERE email = ?

            LIMIT 1
          `,
          [
            normalizedEmail,
          ]
        )


      const admin =
        rows[0]


      /*
      |--------------------------------------------------------------------------
      | Do not reveal whether email exists
      |--------------------------------------------------------------------------
      */

      if (
        !admin ||
        !Boolean(
          admin.active
        )
      ) {

        res.status(401)

        throw new Error(
          'Invalid email or password.'
        )

      }


      const passwordMatches =
        await bcrypt.compare(
          password,
          admin.password_hash
        )


      if (
        !passwordMatches
      ) {

        res.status(401)

        throw new Error(
          'Invalid email or password.'
        )

      }


      const token =
        createAdminToken(
          admin
        )


      res.cookie(
        COOKIE_NAME,
        token,
        getCookieOptions()
      )


      await pool.execute(
        `
          UPDATE admin_users

          SET
            last_login_at =
              CURRENT_TIMESTAMP

          WHERE id = ?
        `,
        [
          admin.id,
        ]
      )


      res.set(
        'Cache-Control',
        'no-store'
      )


      res.status(200).json({
        success: true,

        message:
          'Login successful.',

        admin: {
          id:
            admin.id,

          name:
            admin.name,

          email:
            admin.email,

          role:
            'admin',
        },
      })

    } catch (error) {
      next(error)
    }

  }


/*
|--------------------------------------------------------------------------
| GET /api/admin/auth/me
|--------------------------------------------------------------------------
*/

export const getCurrentAdmin =
  async (
    req,
    res,
    next
  ) => {

    try {

      const [rows] =
        await pool.execute(
          `
            SELECT
              id,
              name,
              email,
              active,
              last_login_at

            FROM admin_users

            WHERE id = ?

            LIMIT 1
          `,
          [
            req.admin.id,
          ]
        )


      const admin =
        rows[0]


      if (
        !admin ||
        !Boolean(
          admin.active
        )
      ) {

        res.status(401)

        throw new Error(
          'Admin account is not available.'
        )

      }


      res.set(
        'Cache-Control',
        'no-store'
      )


      res.status(200).json({
        success: true,

        admin: {
          id:
            admin.id,

          name:
            admin.name,

          email:
            admin.email,

          role:
            'admin',

          lastLoginAt:
            admin.last_login_at ||
            null,
        },
      })

    } catch (error) {
      next(error)
    }

  }


/*
|--------------------------------------------------------------------------
| POST /api/admin/auth/logout
|--------------------------------------------------------------------------
*/

export const logoutAdmin =
  async (
    req,
    res,
    next
  ) => {

    try {

      res.clearCookie(
        COOKIE_NAME,
        {
          httpOnly: true,

          secure:
            process.env
              .NODE_ENV ===
            'production',

          sameSite:
            'lax',

          path: '/',
        }
      )


      res.set(
        'Cache-Control',
        'no-store'
      )


      res.status(200).json({
        success: true,

        message:
          'Logged out successfully.',
      })

    } catch (error) {
      next(error)
    }

  }

  /*
|--------------------------------------------------------------------------
| PUT /api/admin/auth/profile
|--------------------------------------------------------------------------
*/

export const updateAdminProfile =
  async (
    req,
    res,
    next
  ) => {

    try {

      const name =
        req.body.name
          ?.trim()


      if (!name) {

        res.status(400)

        throw new Error(
          'Administrator name is required.'
        )

      }


      if (
        name.length > 120
      ) {

        res.status(400)

        throw new Error(
          'Administrator name is too long.'
        )

      }


      const [result] =
        await pool.execute(
          `
            UPDATE admin_users

            SET
              name = ?

            WHERE
              id = ?
              AND active = 1
          `,
          [
            name,
            req.admin.id,
          ]
        )


      if (
        result.affectedRows === 0
      ) {

        res.status(404)

        throw new Error(
          'Administrator account not found.'
        )

      }


      const [rows] =
        await pool.execute(
          `
            SELECT
              id,
              name,
              email

            FROM admin_users

            WHERE id = ?

            LIMIT 1
          `,
          [
            req.admin.id,
          ]
        )


      res.status(200).json({
        success: true,

        message:
          'Administrator name updated successfully.',

        admin: {
          id:
            rows[0].id,

          name:
            rows[0].name,

          email:
            rows[0].email,

          role:
            'admin',
        },
      })

    } catch (error) {
      next(error)
    }

  }


/*
|--------------------------------------------------------------------------
| PUT /api/admin/auth/password
|--------------------------------------------------------------------------
*/

export const changeAdminPassword =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        currentPassword,
        newPassword,
      } = req.body


      if (
        !currentPassword ||
        !newPassword
      ) {

        res.status(400)

        throw new Error(
          'Current password and new password are required.'
        )

      }


      if (
        newPassword.length < 8
      ) {

        res.status(400)

        throw new Error(
          'New password must contain at least 8 characters.'
        )

      }


      if (
        currentPassword ===
        newPassword
      ) {

        res.status(400)

        throw new Error(
          'New password must be different from the current password.'
        )

      }


      const [rows] =
        await pool.execute(
          `
            SELECT
              id,
              password_hash,
              active

            FROM admin_users

            WHERE id = ?

            LIMIT 1
          `,
          [
            req.admin.id,
          ]
        )


      const admin =
        rows[0]


      if (
        !admin ||
        !Boolean(
          admin.active
        )
      ) {

        res.status(401)

        throw new Error(
          'Administrator account is unavailable.'
        )

      }


      const passwordMatches =
        await bcrypt.compare(
          currentPassword,
          admin.password_hash
        )


      if (
        !passwordMatches
      ) {

        res.status(400)

        throw new Error(
          'Current password is incorrect.'
        )

      }


      const newPasswordHash =
        await bcrypt.hash(
          newPassword,
          12
        )


      await pool.execute(
        `
          UPDATE admin_users

          SET
            password_hash = ?

          WHERE id = ?
        `,
        [
          newPasswordHash,
          req.admin.id,
        ]
      )


      res.status(200).json({
        success: true,

        message:
          'Password changed successfully.',
      })

    } catch (error) {
      next(error)
    }

  }