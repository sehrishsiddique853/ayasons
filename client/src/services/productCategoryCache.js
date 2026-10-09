import api from './api'

const CACHE_DURATION = 15 * 1000
const categoryCache = new Map()
const pendingRequests = new Map()

export const getCachedProductCategory = (slug) => {
  const cached = categoryCache.get(slug)

  if (
    !cached ||
    Date.now() - cached.savedAt > CACHE_DURATION
  ) {
    return null
  }

  return cached.data
}

export const loadProductCategory = async (slug) => {
  const cached = getCachedProductCategory(slug)

  if (cached) {
    return cached
  }

  if (pendingRequests.has(slug)) {
    return pendingRequests.get(slug)
  }

  const request = api
    .get(`/products/category/${slug}`, {
      params: {
        updatedAt: Date.now(),
      },
    })
    .then(async (response) => {
      const data = response.data

      categoryCache.set(slug, {
        data,
        savedAt: Date.now(),
      })

      return data
    })
    .finally(() => {
      pendingRequests.delete(slug)
    })

  pendingRequests.set(slug, request)
  return request
}

