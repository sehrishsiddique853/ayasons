import axios from 'axios'


const API_BASE =
  import.meta.env.VITE_API_URL ||
  '/api'


const api = axios.create({
  baseURL: API_BASE,

  withCredentials: true,
})


/*
|--------------------------------------------------------------------------
| Resolve Backend Media URLs
|--------------------------------------------------------------------------
|
| The backend may return:
|
| http://localhost:5000/api/admin/products/1/image
|
| while the admin may be running through:
|
| localhost:5173
| VS Code Dev Tunnel
| another frontend domain
|
| During development we convert backend media URLs to:
|
| /api/admin/products/1/image
|
| Vite then proxies the request to port 5000.
|
| In production, when VITE_API_URL is an absolute URL,
| the configured API domain is used.
|
*/

const resolveMediaUrl = (
  value
) => {

  if (
    typeof value !==
    'string'
  ) {
    return value
  }


  const apiMarker =
    '/api/'


  const apiIndex =
    value.indexOf(
      apiMarker
    )


  /*
   * Not one of our API URLs.
   * Leave it untouched.
   */
  if (apiIndex === -1) {
    return value
  }


  const apiPath =
    value.slice(
      apiIndex
    )


  /*
   * Production / remote API.
   *
   * Example:
   * VITE_API_URL=https://api.ayosons.com/api
   */
  if (
    /^https?:\/\//i.test(
      API_BASE
    )
  ) {

    try {

      const apiOrigin =
        new URL(
          API_BASE
        ).origin


      return (
        `${apiOrigin}${apiPath}`
      )

    } catch {

      return value

    }

  }


  /*
   * Local development.
   *
   * Return:
   * /api/...
   *
   * Vite proxy handles it.
   */
  return apiPath

}


/*
|--------------------------------------------------------------------------
| Normalize URLs Inside API Responses
|--------------------------------------------------------------------------
*/

const normalizeMediaUrls = (
  value
) => {

  if (
    Array.isArray(
      value
    )
  ) {

    return value.map(
      normalizeMediaUrls
    )

  }


  if (
    !value ||
    typeof value !==
      'object'
  ) {

    return value

  }


  /*
   * Only recurse through normal
   * JSON objects.
   */
  if (
    Object.prototype
      .toString
      .call(value) !==
    '[object Object]'
  ) {

    return value

  }


  return Object.fromEntries(

    Object.entries(
      value
    ).map(
      (
        [
          key,
          itemValue,
        ]
      ) => {

        if (
          key === 'url' &&
          typeof itemValue ===
            'string'
        ) {

          return [
            key,
            resolveMediaUrl(
              itemValue
            ),
          ]

        }


        return [
          key,
          normalizeMediaUrls(
            itemValue
          ),
        ]

      }
    )

  )

}


/*
|--------------------------------------------------------------------------
| Axios Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors
api.interceptors
  .response
  .use(

    (
      response
    ) => {

      response.data =
        normalizeMediaUrls(
          response.data
        )


      return response

    },


    (
      error
    ) => {

      const status =
        error.response
          ?.status


      const requestUrl =
        error.config
          ?.url ||
        ''


      const isLoginRequest =
        requestUrl.includes(
          '/admin/auth/login'
        )


      if (
        status === 401 &&
        !isLoginRequest
      ) {

        window.dispatchEvent(
          new Event(
            'admin:unauthorized'
          )
        )

      }


      return Promise.reject(
        error
      )

    }

  )


export default api