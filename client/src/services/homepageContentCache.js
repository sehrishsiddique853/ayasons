import api from './api'

const CACHE_DURATION = 5 * 60 * 1000

let cachedContent = null
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
        // The loaded image remains displayable.
      }

      resolve()
    }

    image.onerror = resolve
    image.src = url
  })
}

export const getCachedHomepageContent = () => {
  if (
    !cachedContent ||
    Date.now() - cachedAt > CACHE_DURATION
  ) {
    return null
  }

  return cachedContent
}

export const loadHomepageContent = async () => {
  const cached = getCachedHomepageContent()

  if (cached) return cached
  if (pendingRequest) return pendingRequest

  pendingRequest = api
    .get('/home-content', {
      params: { updatedAt: Date.now() },
    })
    .then(async (response) => {
      const content = response.data.content || null
      const aboutImage = content?.aboutImage?.available
        ? content.aboutImage.url
        : null

      await preloadImage(aboutImage)

      cachedContent = content
      cachedAt = Date.now()

      return content
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

