import { execFile } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import pool from '../config/mysql.js'


const execFileAsync =
  promisify(execFile)


const __filename =
  fileURLToPath(import.meta.url)


const __dirname =
  path.dirname(__filename)


const imageCacheDirectory =
  path.resolve(
    __dirname,
    '../../.cache/images'
  )


const defaultOptimizedImageWidth =
  1400


const minimumOptimizedImageWidth =
  320


const maximumOptimizedImageWidth =
  1800


const optimizedImageQuality =
  72


const isOptimizableImage =
  (mimeType = '') => {
    return [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ].includes(
      mimeType.toLowerCase()
    )
  }


const sanitizeCacheKey =
  (cacheKey) => {
    return String(cacheKey)
      .replace(/[^a-z0-9_.-]/gi, '-')
  }


const fileExists =
  async (filePath) => {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }


const optimizeImageBuffer =
  async (
    imageBuffer,
    cacheKey,
    requestedWidth =
      defaultOptimizedImageWidth
  ) => {
    if (
      process.platform !== 'win32' ||
      !imageBuffer?.length
    ) {
      return null
    }


    await fs.mkdir(
      imageCacheDirectory,
      {
        recursive: true,
      }
    )


    const optimizedWidth =
      Math.min(
        maximumOptimizedImageWidth,
        Math.max(
          minimumOptimizedImageWidth,
          Math.round(
            requestedWidth
          )
        )
      )


    const safeCacheKey =
      sanitizeCacheKey(cacheKey)


    const outputPath =
      path.join(
        imageCacheDirectory,
        `${safeCacheKey}-w${optimizedWidth}.jpg`
      )


    if (
      await fileExists(outputPath)
    ) {
      return fs.readFile(outputPath)
    }


    const sourcePath =
      path.join(
        imageCacheDirectory,
        `${safeCacheKey}-w${optimizedWidth}.source`
      )


    await fs.writeFile(
      sourcePath,
      imageBuffer
    )


    const powershellScript =
      `
      Add-Type -AssemblyName System.Drawing

      $sourcePath = @'
${sourcePath}
'@
      $outputPath = @'
${outputPath}
'@

      $sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
      $largestSide = [Math]::Max($sourceImage.Width, $sourceImage.Height)
      $scale = [Math]::Min(1.0, ${optimizedWidth} / [double]$largestSide)
      $targetWidth = [Math]::Max(1, [int]($sourceImage.Width * $scale))
      $targetHeight = [Math]::Max(1, [int]($sourceImage.Height * $scale))

      $bitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.Clear([System.Drawing.Color]::Black)
      $graphics.DrawImage($sourceImage, 0, 0, $targetWidth, $targetHeight)

      $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
      $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]${optimizedImageQuality})
      $bitmap.Save($outputPath, $jpegCodec, $encoderParameters)

      $graphics.Dispose()
      $bitmap.Dispose()
      $sourceImage.Dispose()
      `


    const encodedCommand =
      Buffer
        .from(
          powershellScript,
          'utf16le'
        )
        .toString('base64')


    try {
      await execFileAsync(
        'powershell.exe',
        [
          '-NoProfile',
          '-ExecutionPolicy',
          'Bypass',
          '-EncodedCommand',
          encodedCommand,
        ],
        {
          timeout: 30000,
          windowsHide: true,
        }
      )


      const optimizedBuffer =
        await fs.readFile(outputPath)


      return optimizedBuffer
    } finally {
      await fs.rm(
        sourcePath,
        {
          force: true,
        }
      )
    }
  }


const sendImageResponse =
  async (
    req,
    res,
    {
      imageBlob,
      imageMime,
      imageName,
      cacheKey,
      fallbackName,
    }
  ) => {
    let responseBuffer =
      imageBlob


    let responseMime =
      imageMime ||
      'application/octet-stream'


    let responseName =
      imageName ||
      fallbackName


    const requestedWidth =
      Number(req.query.w)


    const optimizedWidth =
      Number.isFinite(requestedWidth)
        ? Math.round(requestedWidth)
        : defaultOptimizedImageWidth


    if (
      isOptimizableImage(responseMime)
    ) {
      try {
        const optimizedBuffer =
          await optimizeImageBuffer(
            imageBlob,
            cacheKey,
            optimizedWidth
          )


        if (
          optimizedBuffer?.length &&
          optimizedBuffer.length < imageBlob.length
        ) {
          responseBuffer =
            optimizedBuffer


          responseMime =
            'image/jpeg'


          responseName =
            responseName
              ? responseName.replace(
                /\.[^.]+$/,
                '.jpg'
              )
              : `${fallbackName}.jpg`
        }
      } catch (error) {
        console.warn(
          'Image optimization failed; serving original image:',
          error.message
        )
      }
    }


    res.set({
      'Content-Type':
        responseMime,

      'Content-Length':
        responseBuffer.length,

      'Content-Disposition':
        `inline; filename="${responseName || fallbackName}"`,

      'Cache-Control':
        'public, max-age=604800, immutable',
    })


    res.send(
      responseBuffer
    )
  }


const getCategoryImage =
  async (
    req,
    res,
    next,
    type
  ) => {
    try {
      const categoryId =
        Number(req.params.id)


      if (
        !Number.isInteger(categoryId) ||
        categoryId <= 0
      ) {
        res.status(400)

        throw new Error(
          'Invalid category ID'
        )
      }


      const isHero =
        type === 'hero'


      const blobColumn =
        isHero
          ? 'hero_image_blob'
          : 'collection_image_blob'


      const mimeColumn =
        isHero
          ? 'hero_image_mime'
          : 'collection_image_mime'


      const nameColumn =
        isHero
          ? 'hero_image_name'
          : 'collection_image_name'


      const [rows] =
        await pool.query(
          `
          SELECT
            ${blobColumn} AS image_blob,
            ${mimeColumn} AS image_mime,
            ${nameColumn} AS image_name,
            updated_at

          FROM categories

          WHERE
            id = ?
            AND active = 1

          LIMIT 1
          `,
          [
            categoryId,
          ]
        )


      if (
        rows.length === 0 ||
        !rows[0].image_blob
      ) {
        res.status(404)

        throw new Error(
          'Category image not found'
        )
      }


      const image =
        rows[0]


      await sendImageResponse(
        req,
        res,
        {
          imageBlob:
            image.image_blob,

          imageMime:
            image.image_mime,

          imageName:
            image.image_name,

          cacheKey:
            `category-${type}-${categoryId}-${new Date(image.updated_at).getTime()}`,

          fallbackName:
            `category-${type}-${categoryId}`,
        }
      )

    } catch (error) {
      next(error)
    }
  }


export const getCategoryHeroImage =
  async (
    req,
    res,
    next
  ) => {
    return getCategoryImage(
      req,
      res,
      next,
      'hero'
    )
  }


export const getCategoryCollectionImage =
  async (
    req,
    res,
    next
  ) => {
    return getCategoryImage(
      req,
      res,
      next,
      'collection'
    )
  }

  export const getProductImage =
  async (
    req,
    res,
    next
  ) => {
    try {
      const productId =
        Number(req.params.id)


      if (
        !Number.isInteger(
          productId
        ) ||
        productId <= 0
      ) {
        res.status(400)

        throw new Error(
          'Invalid product ID'
        )
      }


      const [rows] =
        await pool.execute(
          `
          SELECT
            p.image_blob,
            p.image_mime,
            p.image_name,
            p.updated_at

          FROM products p

          INNER JOIN categories c
            ON c.id =
              p.category_id

          WHERE
            p.id = ?
            AND p.active = 1
            AND c.active = 1

          LIMIT 1
          `,
          [
            productId,
          ]
        )


      if (
        rows.length === 0 ||
        !rows[0].image_blob
      ) {
        res.status(404)

        throw new Error(
          'Product image not found'
        )
      }


      const image =
        rows[0]


      await sendImageResponse(
        req,
        res,
        {
          imageBlob:
            image.image_blob,

          imageMime:
            image.image_mime,

          imageName:
            image.image_name,

          cacheKey:
            `product-${productId}-${new Date(image.updated_at).getTime()}`,

          fallbackName:
            `product-${productId}`,
        }
      )

    } catch (error) {
      next(error)
    }
  }
