import path from 'node:path'
import sharp from 'sharp'

const allowedWidths = [320, 480, 640, 960, 1280, 1600]
const resizedImageCache = new Map()
const MAX_CACHE_ENTRIES = 100

const getRequestedWidth = (value) => {
  const requestedWidth = Number(value)

  if (!Number.isFinite(requestedWidth) || requestedWidth <= 0) {
    return null
  }

  return allowedWidths.find((width) => width >= requestedWidth) || 1600
}

const cacheImage = (key, value) => {
  if (resizedImageCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = resizedImageCache.keys().next().value
    resizedImageCache.delete(oldestKey)
  }

  resizedImageCache.set(key, value)
}

export const sendResponsiveImage = async (
  req,
  res,
  {
    imageBlob,
    imageMime,
    imageName,
    fallbackName,
    cacheKey,
  }
) => {
  if (!imageBlob?.length) {
    const error = new Error('Image not found')
    error.statusCode = 404
    throw error
  }

  const requestedWidth = getRequestedWidth(req.query.w)
  let responseBuffer = imageBlob
  let responseMime = imageMime || 'application/octet-stream'
  let responseName = imageName || fallbackName

  if (requestedWidth) {
    const variantKey = `${cacheKey}:${requestedWidth}`
    const cachedVariant = resizedImageCache.get(variantKey)

    if (cachedVariant) {
      responseBuffer = cachedVariant
    } else {
      responseBuffer = await sharp(imageBlob)
        .rotate()
        .resize({
          width: requestedWidth,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 78, effort: 3 })
        .toBuffer()

      cacheImage(variantKey, responseBuffer)
    }

    responseMime = 'image/webp'
    responseName = `${path.parse(responseName || fallbackName).name}.webp`
  }

  res.set({
    'Content-Type': responseMime,
    'Content-Length': responseBuffer.length,
    'Content-Disposition': `inline; filename="${responseName || fallbackName}"`,
    'Cache-Control': 'public, max-age=604800, immutable',
  })

  res.send(responseBuffer)
}
