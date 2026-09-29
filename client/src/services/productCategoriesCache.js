import api from './api'

const CACHE_DURATION = 5 * 60 * 1000

let cachedCategories = null
let cachedAt = 0
let pendingRequest = null

const preloadImage = (url) => {
  if (!url) return Promise.resolve()

  return new Promise((resolve) => {
    const image = new Image()

    image.onload = async () => {
      try {
        await image.decode?.()
      } catch {
        // The loaded image remains usable if explicit decoding fails.
      }

      resolve()
    }

    image.onerror = resolve
    image.src = url
  })
}

export const getCachedProductCategories = () => {
  if (
    !cachedCategories ||
    Date.now() - cachedAt > CACHE_DURATION
  ) {
    return null
  }

  return cachedCategories
}

export const loadProductCategories = async () => {
  const cached = getCachedProductCategories()

  if (cached) return cached
  if (pendingRequest) return pendingRequest

  pendingRequest = api
    .get('/categories', {
      params: { updatedAt: Date.now() },
    })
    .then(async (response) => {
      const categories = response.data.categories || []
      const imageUrls = categories
        .map(
          (category) =>
            category.collectionImage?.url ||
            category.heroImage?.url
        )
        .filter(Boolean)

      await Promise.all(
        [...new Set(imageUrls)].map(preloadImage)
      )

      cachedCategories = categories
      cachedAt = Date.now()

      return categories
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

