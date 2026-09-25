import multer from 'multer'


const storage =
  multer.memoryStorage()


/*
|--------------------------------------------------------------------------
| Logo Image
|--------------------------------------------------------------------------
*/

const logoMimeTypes =
  new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ])


const logoFilter = (
  req,
  file,
  callback
) => {

  if (
    logoMimeTypes.has(
      file.mimetype
    )
  ) {

    callback(
      null,
      true
    )

    return
  }


  const error =
    new Error(
      'Certificate logo must be JPG, PNG or WEBP.'
    )


  error.statusCode = 415


  callback(
    error,
    false
  )
}


export const uploadStandardLogo =
  multer({
    storage,

    fileFilter:
      logoFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024,

      files: 1,
    },
  })


/*
|--------------------------------------------------------------------------
| Actual Certificate
|--------------------------------------------------------------------------
*/

const certificateMimeTypes =
  new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
  ])


const certificateFilter = (
  req,
  file,
  callback
) => {

  if (
    certificateMimeTypes.has(
      file.mimetype
    )
  ) {

    callback(
      null,
      true
    )

    return
  }


  const error =
    new Error(
      'Certificate must be PDF, JPG, PNG or WEBP.'
    )


  error.statusCode = 415


  callback(
    error,
    false
  )
}


export const uploadCertificate =
  multer({
    storage,

    fileFilter:
      certificateFilter,

    limits: {
      fileSize:
        10 * 1024 * 1024,

      files: 1,
    },
  })