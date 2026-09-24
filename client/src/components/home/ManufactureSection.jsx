import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
} from 'react-router-dom'

import api from '../../services/api'

const createCategoryPath = (category) => {
  const slug =
    category?.slug ||
    category?.name ||
    ''

  const normalizedSlug =
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  return `/products/${normalizedSlug}`
}


function ManufactureSection() {
  const [
    categories,
    setCategories,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {
    const controller =
      new AbortController()


    const loadCategories =
      async () => {
        try {
          setLoading(true)
          setError('')


          const response =
            await api.get(
              '/categories',
              {
                signal:
                  controller.signal,
              }
            )


          setCategories(
            response.data.categories ||
              []
          )

        } catch (requestError) {

          if (
            requestError.code ===
            'ERR_CANCELED'
          ) {
            return
          }


          console.error(
            'Failed to load categories:',
            requestError
          )


          setError(
            'Unable to load collections right now.'
          )

        } finally {

          if (
            !controller.signal.aborted
          ) {
            setLoading(false)
          }
        }
      }


    loadCategories()


    return () => {
      controller.abort()
    }

  }, [])


  return (
    <section
      className="manufacture-section"
      id="products"
    >

      <div className="manufacture-header">

        <p className="range-pill">
          Collections
        </p>

        <h2>
          <span>
            What We Manufacture
          </span>
        </h2>

        <div
          className="section-accent"
          aria-hidden="true"
        />

      </div>


      {loading && (
        <p className="manufacture-status">
          Loading collections...
        </p>
      )}


      {!loading && error && (
        <p className="manufacture-status manufacture-status-error">
          {error}
        </p>
      )}


      {!loading &&
        !error &&
        categories.length === 0 && (
          <p className="manufacture-status">
            No collections available.
          </p>
        )}


      {!loading &&
        !error &&
        categories.length > 0 && (
          <div className="manufacture-grid">

            {categories.map(
              (
                category,
                index
              ) => {

                /*
                |--------------------------------------------------------------------------
                | Image
                |--------------------------------------------------------------------------
                */

                const cardImage =
                  category
                    .collectionImage
                    ?.url ||
                  category
                    .heroImage
                    ?.url ||
                  ''


                /*
                |--------------------------------------------------------------------------
                | Description
                |--------------------------------------------------------------------------
                */

                const cardDescription =
                  category
                    .collectionDescription ||
                  category.description ||
                  ''


                return (
                  <Link
                    className="manufacture-card"

                    to={
                      createCategoryPath(
                        category
                      )
                    }

                    key={
                      category._id ||
                      category.slug
                    }

                    style={{
                      '--card-image':
                        `url("${cardImage}")`,
                    }}
                  >

                    <span className="card-number">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        '0'
                      )}
                    </span>


                    <div className="manufacture-card-content">

                      <h3>
                        {category.name}
                      </h3>


                      <span className="card-rule" />


                      <p>
                        {cardDescription}
                      </p>


                      <span className="manufacture-explore-button">

                        Explore

                        <span aria-hidden="true">
                          →
                        </span>

                      </span>

                    </div>

                  </Link>
                )
              }
            )}

          </div>
        )}

    </section>
  )
}


export default ManufactureSection
