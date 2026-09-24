export const notFound = (
  req,
  res,
  next
) => {
  const error =
    new Error(
      `Route not found: ${req.originalUrl}`
    )


  res.status(404)

  next(error)
}


export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  /*
  |--------------------------------------------------------------------------
  | Multer File Too Large
  |--------------------------------------------------------------------------
  */

  if (
    err.code ===
    'LIMIT_FILE_SIZE'
  ) {
    return res
      .status(413)
      .json({
        success: false,

        message:
          'Image is too large. Maximum allowed size is 5 MB.',
      })
  }


  /*
  |--------------------------------------------------------------------------
  | Too Many Files
  |--------------------------------------------------------------------------
  */

  if (
    err.code ===
      'LIMIT_FILE_COUNT' ||
    err.code ===
      'LIMIT_UNEXPECTED_FILE'
  ) {
    return res
      .status(400)
      .json({
        success: false,

        message:
          'Only one image may be uploaded at a time.',
      })
  }


  /*
  |--------------------------------------------------------------------------
  | Normal Error
  |--------------------------------------------------------------------------
  */

  const statusCode =
    err.statusCode ||
    (
      res.statusCode === 200
        ? 500
        : res.statusCode
    )


  res
    .status(statusCode)
    .json({
      success: false,

      message:
        err.message ||
        'Internal server error',

      stack:
        process.env
          .NODE_ENV ===
        'production'
          ? undefined
          : err.stack,
    })
}