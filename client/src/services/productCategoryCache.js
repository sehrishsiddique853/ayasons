import api from './api'

const CACHE_DURATION = 15 * 1000
const categoryCache = new Map()
const pendingRequests = new Map()

const preloadImage = (url) => {
  if (!url) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const image = new Image()

    image.onload = async () => {
      try {
        await image.decode?.()
      } catch {
        // A loaded image can still be displayed when decode is unavailable.
      }

      resolve()
    }

    image.onerror = resolve
    image.src = url
  })
}

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
      const imageUrls = [
        data.category?.heroImage?.url,
        data.category?.collectionImage?.url,
        ...(data.products || []).map(
          (product) => product.image?.url
        ),
      ].filter(Boolean)

      await Promise.all(
        [...new Set(imageUrls)].map(preloadImage)
      )

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

