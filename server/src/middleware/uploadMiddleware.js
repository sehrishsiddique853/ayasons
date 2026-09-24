import multer from 'multer'


/*
|--------------------------------------------------------------------------
| Allowed Image Types
|--------------------------------------------------------------------------
*/

const allowedMimeTypes =
  new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ])


/*
|--------------------------------------------------------------------------
| Memory Storage
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| The image is NOT written to disk.
|
| Multer keeps it temporarily in:
|
| req.file.buffer
|
| We will later save that Buffer directly into MySQL LONGBLOB.
|
*/

const storage =
  multer.memoryStorage()


/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
*/

const imageFileFilter = (
  req,
  file,
  callback
) => {
  if (
    allowedMimeTypes.has(
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
      'Only JPG, JPEG, PNG and WEBP images are allowed.'
    )


  error.statusCode = 415


  callback(
    error,
    false
  )
}


/*
|--------------------------------------------------------------------------
| Image Upload
|--------------------------------------------------------------------------
|
| Maximum size: 5 MB
|
*/

export const uploadImage =
  multer({
    storage,

    fileFilter:
      imageFileFilter,

    limits: {
      fileSize:
        5 *
        1024 *
        1024,

      files: 1,
    },
  })


export default uploadImage

export const uploadCategoryImages =
  multer({
    storage,

    fileFilter:
      imageFileFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024,

      files: 2,
    },
  })


export const uploadProductImage =
  multer({
    storage,

    fileFilter:
      imageFileFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024,

      files: 1,
    },
  })
