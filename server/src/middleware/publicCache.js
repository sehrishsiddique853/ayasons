const cacheStore =
  new Map()


const defaultTtlMs =
  Number(
    process.env.PUBLIC_CACHE_TTL_MS ||
    30000
  )


const makeCacheKey =
  (req) =>
    `${req.method}:${req.originalUrl}`


export const clearPublicCache =
  () => {
    cacheStore.clear()
  }


export const publicJsonCache =
  (
    ttlMs = defaultTtlMs
  ) => {
    return (
      req,
      res,
      next
    ) => {
      if (
        req.method !== 'GET' ||
        req.headers.authorization
      ) {
        return next()
      }


      const cacheKey =
        makeCacheKey(req)


      const cached =
        cacheStore.get(cacheKey)


      if (
        cached &&
        cached.expiresAt > Date.now()
      ) {
        res.set(
          'X-Cache',
          'HIT'
        )

        return res
          .status(cached.statusCode)
          .json(cached.body)
      }


      const originalJson =
        res.json.bind(res)


      res.json = (body) => {
        if (
          res.statusCode >= 200 &&
          res.statusCode < 300
        ) {
          cacheStore.set(
            cacheKey,
            {
              statusCode:
                res.statusCode,

              body,

              expiresAt:
                Date.now() + ttlMs,
            }
          )

          res.set(
            'X-Cache',
            'MISS'
          )
        }


        return originalJson(body)
      }


      return next()
    }
  }
