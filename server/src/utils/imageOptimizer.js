import path from 'node:path'

import sharp from 'sharp'


/*
|--------------------------------------------------------------------------
| Safe WebP File Name
|--------------------------------------------------------------------------
*/

const createWebpFileName =
  (
    originalName = 'image'
  ) => {

    const parsed =
      path.parse(
        originalName
      )


    const safeName =
      parsed.name
        .trim()
        .toLowerCase()
        .replace(
          /[^a-z0-9-_]+/g,
          '-'
        )
        .replace(
          /^-+|-+$/g,
          ''
        ) ||
      'image'


    return `${safeName}.webp`
  }


/*
|--------------------------------------------------------------------------
| Optimize Image
|--------------------------------------------------------------------------
|
| Input:
|
| PNG / JPG / JPEG / WEBP Buffer
|
| Output:
|
| Optimized WEBP Buffer
|
*/

export const optimizeImage =
  async (
    file,
    {
      width = 1600,
      quality = 80,
    } = {}
  ) => {

    if (
      !file?.buffer ||
      !file.buffer.length
    ) {

      const error =
        new Error(
          'Image file is empty or invalid.'
        )


      error.statusCode = 400


      throw error
    }


    try {

      /*
      |--------------------------------------------------------------------------
      | Read Metadata
      |--------------------------------------------------------------------------
      */

      const metadata =
        await sharp(
          file.buffer
        )
          .metadata()


      if (
        !metadata.width ||
        !metadata.height
      ) {

        const error =
          new Error(
            'Unable to read image dimensions.'
          )


        error.statusCode = 415


        throw error
      }


      /*
      |--------------------------------------------------------------------------
      | Optimize
      |--------------------------------------------------------------------------
      */

      const optimizedBuffer =
        await sharp(
          file.buffer
        )

          /*
          | Respect EXIF orientation.
          */

          .rotate()


          /*
          | Resize proportionally.
          |
          | withoutEnlargement means:
          |
          | 800px image + width 1400
          | stays 800px.
          */

          .resize({
            width,

            fit: 'inside',

            withoutEnlargement:
              true,
          })


          /*
          |--------------------------------------------------------------------------
          | Convert To WebP
          |--------------------------------------------------------------------------
          |
          | WebP supports transparency,
          | so transparent PNG logos
          | remain transparent.
          */

          .webp({
            quality,

            effort: 4,
          })


          /*
          | Remove unnecessary metadata.
          */

          .toBuffer()


      /*
      |--------------------------------------------------------------------------
      | Result
      |--------------------------------------------------------------------------
      */

      return {

        buffer:
          optimizedBuffer,

        mimeType:
          'image/webp',

        fileName:
          createWebpFileName(
            file.originalname
          ),

        originalSize:
          file.buffer.length,

        optimizedSize:
          optimizedBuffer.length,

        width:
          metadata.width,

        height:
          metadata.height,
      }

    } catch (error) {

      /*
      |--------------------------------------------------------------------------
      | Preserve Our Own Errors
      |--------------------------------------------------------------------------
      */

      if (
        error.statusCode
      ) {
        throw error
      }


      console.error(
        'Sharp image optimization error:',
        error
      )


      const optimizationError =
        new Error(
          'Uploaded image could not be processed.'
        )


      optimizationError.statusCode =
        415


      throw optimizationError
    }
  }


/*
|--------------------------------------------------------------------------
| Image Presets
|--------------------------------------------------------------------------
|
| These keep image sizing consistent
| throughout AYOSONS.
|
*/

export const IMAGE_PRESETS = {

  categoryHero: {
    width: 1800,
    quality: 82,
  },


  categoryCollection: {
    width: 1400,
    quality: 80,
  },


  product: {
    width: 1400,
    quality: 80,
  },


  productThumbnail: {
    width: 520,
    quality: 78,
  },


  department: {
    width: 1200,
    quality: 80,
  },


  process: {
    width: 1000,
    quality: 80,
  },


  homepageAbout: {
    width: 1600,
    quality: 82,
  },


  certificationLogo: {
    width: 600,
    quality: 85,
  },


  certificateImage: {
    width: 2000,
    quality: 88,
  },

}