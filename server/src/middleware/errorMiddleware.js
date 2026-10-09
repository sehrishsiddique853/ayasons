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
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Request body contains invalid JSON.',
    })
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request body is too large.',
    })
  }

  if (
    err instanceof TypeError &&
    /(?:trim|toLowerCase|replace) is not a function|Cannot destructure property/i.test(err.message)
  ) {
    return res.status(400).json({
      success: false,
      message: 'One or more submitted fields have the wrong format.',
    })
  }

  const conflictCodes = new Set([
    'ER_DUP_ENTRY',
    'ER_ROW_IS_REFERENCED_2',
  ])
  const invalidInputCodes = new Set([
    'ER_BAD_NULL_ERROR',
    'ER_DATA_TOO_LONG',
    'ER_NO_DEFAULT_FOR_FIELD',
    'ER_NO_REFERENCED_ROW_2',
    'ER_TRUNCATED_WRONG_VALUE',
    'WARN_DATA_TRUNCATED',
    'ER_INVALID_JSON_TEXT',
    'ER_CHECK_CONSTRAINT_VIOLATED',
    'ER_WARN_DATA_OUT_OF_RANGE',
  ])

  if (conflictCodes.has(err.code)) {
    return res.status(409).json({
      success: false,
      message: 'This record conflicts with existing data or is still in use.',
    })
  }

  if (invalidInputCodes.has(err.code)) {
    return res.status(400).json({
      success: false,
      message: 'Some submitted values are invalid. Review the fields and try again.',
    })
  }

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
  'Uploaded file is too large. Images must be 5 MB or smaller and homepage videos must be 50 MB or smaller.',
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
