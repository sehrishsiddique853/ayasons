const responseCache = new Map()
const MAX_CACHE_BYTES = 64 * 1024 * 1024
const MAX_CACHE_ENTRIES = 250
let cachedBytes = 0

const imagePathPattern = /^\/api\/(?:images\/(?:categories\/\d+\/(?:hero|collection)|products\/\d+)|departments\/\d+\/image|home-content\/(?:about-image|process\/\d+\/image)|standards\/\d+\/logo)(?:\?|$)/

const removeOldestEntry = () => {
  const oldestKey = responseCache.keys().next().value
  if (!oldestKey) return

  cachedBytes -= responseCache.get(oldestKey).body.length
  responseCache.delete(oldestKey)
}

export const cachePublicImage = (req, res, next) => {
  if (
    req.method !== 'GET' ||
    !imagePathPattern.test(req.originalUrl)
  ) {
    return next()
  }

  const cacheKey = req.originalUrl
  const cached = responseCache.get(cacheKey)

  if (cached) {
    res.set(cached.headers)
    res.set('X-Image-Cache', 'HIT')
    return res.status(200).send(cached.body)
  }

  const originalSend = res.send.bind(res)

  res.send = (body) => {
    if (res.statusCode === 200 && Buffer.isBuffer(body)) {
      const headers = {
        'Content-Type': res.get('Content-Type'),
        'Content-Length': res.get('Content-Length'),
        'Content-Disposition': res.get('Content-Disposition'),
        'Cache-Control': res.get('Cache-Control'),
      }

      while (
        responseCache.size >= MAX_CACHE_ENTRIES ||
        cachedBytes + body.length > MAX_CACHE_BYTES
      ) {
        if (responseCache.size === 0) break
        removeOldestEntry()
      }

      responseCache.set(cacheKey, {
        body,
        headers,
      })
      cachedBytes += body.length
      res.set('X-Image-Cache', 'MISS')
    }

    return originalSend(body)
  }

  return next()
}
