import api from './api'

const CACHE_DURATION = 60 * 1000

let cachedProducts = null
let cachedAt = 0
let pendingRequest = null

export const loadProductList = async () => {
  if (
    cachedProducts &&
    Date.now() - cachedAt < CACHE_DURATION
  ) {
    return cachedProducts
  }

  if (pendingRequest) {
    return pendingRequest
  }

  pendingRequest = api
    .get('/products')
    .then((response) => {
      cachedProducts = response.data.products || []
      cachedAt = Date.now()
      return cachedProducts
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}
