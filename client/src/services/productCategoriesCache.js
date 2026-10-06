import api from './api'

const CACHE_DURATION = 5 * 60 * 1000

let cachedCategories = null
let cachedAt = 0
let pendingRequest = null

export const getCachedProductCategories = () => {
  if (
    !cachedCategories ||
    Date.now() - cachedAt > CACHE_DURATION
  ) {
    return null
  }

  return cachedCategories
}

export const getLastProductCategories = () => cachedCategories

export const loadProductCategories = async () => {
  const cached = getCachedProductCategories()

  if (cached) return cached
  if (pendingRequest) return pendingRequest

  pendingRequest = api
    .get('/categories', {
      params: { updatedAt: Date.now() },
    })
    .then((response) => {
      const categories = response.data.categories || []

      cachedCategories = categories
      cachedAt = Date.now()

      return categories
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

