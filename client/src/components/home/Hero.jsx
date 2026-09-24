import {
  Fragment,
  useEffect,
  useState,
} from 'react'

import {
  Link,
} from 'react-router-dom'

import heroAthlete from '../../assets/images/hero1.png'

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


function Hero() {
  const [
    categories,
    setCategories,
  ] = useState([])

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0)


  /*
  |--------------------------------------------------------------------------
  | Load Active Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller =
      new AbortController()


    const loadCategories =
      async () => {
        try {
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

        } catch (error) {

          if (
            error.code ===
            'ERR_CANCELED'
          ) {
            return
          }


          console.error(
            'Failed to load hero categories:',
            error
          )
        }
      }


    loadCategories()


    return () => {
      controller.abort()
    }

  }, [])


  /*
  |--------------------------------------------------------------------------
  | Keep Active Index Valid
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      categories.length > 0 &&
      activeIndex >=
        categories.length
    ) {
      setActiveIndex(0)
    }
  }, [
    categories,
    activeIndex,
  ])


  const activeCategory =
    categories[activeIndex]


  const activeImage =
    activeCategory
      ?.heroImage?.url ||
    activeCategory
      ?.collectionImage?.url ||
    ''


  /*
  |--------------------------------------------------------------------------
  | Previous / Next
  |--------------------------------------------------------------------------
  */

  const goNext = () => {
    if (!categories.length) {
      return
    }


    setActiveIndex(
      (current) =>
        (current + 1) %
        categories.length
    )
  }


  const goPrevious = () => {
    if (!categories.length) {
      return
    }


    setActiveIndex(
      (current) =>
        (
          current -
          1 +
          categories.length
        ) %
        categories.length
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Auto Rotation
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      categories.length <= 1
    ) {
      return undefined
    }


    const reduceMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches


    if (reduceMotion) {
      return undefined
    }


    const interval =
      window.setInterval(
        () => {
          setActiveIndex(
            (current) =>
              (current + 1) %
              categories.length
          )
        },
        4200
      )


    return () => {
      window.clearInterval(
        interval
      )
    }

  }, [categories.length])


  /*
  |--------------------------------------------------------------------------
  | Small Category Strip
  |--------------------------------------------------------------------------
  |
  | Keep the first four categories so the existing hero layout
  | does not become too crowded.
  |
  */

  const stripCategories =
    categories.slice(0, 4)


  return (
    <section
      className="hero-section"
      id="home"
    >

      {/* HERO BACKGROUND */}

      <div className="hero-overlay" />


      <img
        className="hero-image"
        src={heroAthlete}
        alt=""
        aria-hidden="true"
      />


      {/* LEFT SIDE */}

      <div className="hero-content">

        <p className="hero-meta">

          <span>
            Est. 2005
          </span>

          <span>
            Sialkot, Pakistan
          </span>

          <span>
            Ships Worldwide
          </span>

        </p>


        <h1>

          <span>
            Custom
          </span>

          <span>
            Sportswear and Streetwear
          </span>

          <span>
            Manufacturer
          </span>

        </h1>


        <p className="eyebrow">
          in Sialkot, Pakistan
        </p>


        <p className="hero-copy">
          Your manufacturing partner for sportswear,
          streetwear, activewear, workwear and
          private-label apparel — built for brands,
          teams and businesses.
        </p>


        <div className="hero-buttons">

          <a
            className="primary-button"
            href="#products"
          >
            Explore Products
          </a>


          <a
            className="secondary-button"
            href="#contact"
          >
            Request a Quote
          </a>

        </div>


        {/* DYNAMIC CATEGORY STRIP */}

        {stripCategories.length >
          0 && (
          <p className="category-strip">

            {stripCategories.map(
              (
                category,
                index
              ) => (
                <Fragment
                  key={
                    category._id ||
                    category.slug
                  }
                >

                  {category.name}

                  {index <
                    stripCategories.length -
                      1 && (
                    <span>
                      {' '}•{' '}
                    </span>
                  )}

                </Fragment>
              )
            )}

          </p>
        )}

      </div>


      {/* DYNAMIC CATEGORY SHOWCASE */}

      {activeCategory && (
        <div className="hero-category-showcase">

          <div className="hero-showcase-heading">

            <span>
              Explore Categories
            </span>


            <span>

              {String(
                activeIndex + 1
              ).padStart(
                2,
                '0'
              )}

              {' / '}

              {String(
                categories.length
              ).padStart(
                2,
                '0'
              )}

            </span>

          </div>


          <article
            className="hero-showcase-card"

            key={
              activeCategory._id ||
              activeCategory.slug
            }
          >

            {activeImage && (
              <img
                src={activeImage}

                alt={
                  activeCategory.name
                }
              />
            )}


            <div className="hero-showcase-card-overlay" />


            <div className="hero-showcase-card-content">

              <span>
                {activeCategory
                  .showcaseLabel ||
                  activeCategory
                    .eyebrow ||
                  activeCategory.name}
              </span>


              <h2>
                {activeCategory.name}
              </h2>


              <Link
                className="hero-showcase-link"
                to={createCategoryPath(
                  activeCategory
                )}
              >
                Explore

                <span aria-hidden="true">
                  →
                </span>
              </Link>

            </div>


            {/* CAROUSEL CONTROLS */}

            {categories.length >
              1 && (
              <div className="hero-carousel-controls">

                <button
                  type="button"

                  onClick={
                    goPrevious
                  }

                  aria-label="Previous category"
                >
                  ←
                </button>


                <div className="hero-carousel-dots">

                  {categories.map(
                    (
                      category,
                      index
                    ) => (
                      <button
                        type="button"

                        key={
                          category._id ||
                          category.slug
                        }

                        className={
                          index ===
                          activeIndex
                            ? 'active'
                            : ''
                        }

                        onClick={() =>
                          setActiveIndex(
                            index
                          )
                        }

                        aria-label={
                          `Show ${category.name}`
                        }
                      />
                    )
                  )}

                </div>


                <button
                  type="button"

                  onClick={
                    goNext
                  }

                  aria-label="Next category"
                >
                  →
                </button>

              </div>
            )}

          </article>


          {categories.length >
            1 && (
            <div className="hero-showcase-progress">

              <span
                key={
                  activeCategory._id ||
                  activeCategory.slug
                }
              />

            </div>
          )}

        </div>
      )}

    </section>
  )
}


export default Hero
