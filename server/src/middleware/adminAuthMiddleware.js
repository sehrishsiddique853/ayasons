import jwt from 'jsonwebtoken'


const COOKIE_NAME =
  'ayosons_admin_token'


const getTokenFromRequest = (
  req
) => {

  const cookieToken =
    req.cookies?.[
      COOKIE_NAME
    ]


  if (cookieToken) {
    return cookieToken
  }


  /*
   * Optional Bearer token support.
   * Useful for Postman/API testing.
   */
  const authorization =
    req.headers
      .authorization


  if (
    authorization
      ?.startsWith(
        'Bearer '
      )
  ) {

    return authorization
      .slice(7)
      .trim()

  }


  return null
}


export const requireAdmin =
  (
    req,
    res,
    next
  ) => {

    try {

      const token =
        getTokenFromRequest(
          req
        )


      if (!token) {

        res.status(401)

        throw new Error(
          'Authentication required.'
        )

      }


      const secret =
        process.env.JWT_SECRET


      if (!secret) {

        const error =
          new Error(
            'JWT_SECRET is not configured.'
          )

        error.statusCode =
          500

        throw error

      }


      const payload =
        jwt.verify(
          token,
          secret
        )


      if (
        payload.role !==
        'admin'
      ) {

        res.status(403)

        throw new Error(
          'Administrator access required.'
        )

      }


      const id =
        Number(
          payload.sub
        )


      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {

        res.status(401)

        throw new Error(
          'Invalid authentication token.'
        )

      }


      req.admin = {
        id,

        email:
          payload.email,

        role:
          payload.role,
      }


      next()

    } catch (error) {

      if (
        error.name ===
          'JsonWebTokenError' ||
        error.name ===
          'TokenExpiredError' ||
        error.name ===
          'NotBeforeError'
      ) {

        return res
          .status(401)
          .json({
            success: false,

            message:
              'Your session has expired. Please log in again.',
          })

      }


      next(error)

    }

  }