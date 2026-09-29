import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { withImageWidth } from '../../utils/imageUrl'
import { loadProductCategory } from '../../services/productCategoryCache'
import { ManufactureCardSkeletons } from '../common/LoadingSkeletons'

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


function ManufactureSection({
  categories = [],
  loading = false,
  error = '',
}) {
  const navigate = useNavigate()

  const prepareCategory = (category) => {
    const path = createCategoryPath(category)
    const slug = path.split('/').pop()

    return loadProductCategory(slug)
  }

  const openCategory = async (event, category) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()

    try {
      await prepareCategory(category)
    } catch {
      // The destination page will show its normal error state if needed.
    }

    navigate(createCategoryPath(category))
  }

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
        <ManufactureCardSkeletons />
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
                  withImageWidth(
                    category
                      .collectionImage
                      ?.url ||
                    category
                      .heroImage
                      ?.url ||
                    '',
                    640
                  )


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

                    onPointerEnter={() =>
                      prepareCategory(category)
                        .catch(() => {})
                    }

                    onFocus={() =>
                      prepareCategory(category)
                        .catch(() => {})
                    }

                    onClick={(event) =>
                      openCategory(event, category)
                    }

                  >
                    {cardImage && (
                      <img
                        className="manufacture-card-image"
                        src={cardImage}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                    )}

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
