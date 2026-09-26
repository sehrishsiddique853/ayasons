import { useEffect, useState } from 'react'
import heroAthlete from '../../assets/images/optimized/hero1.jpg'
import { withImageWidth } from '../../utils/imageUrl'

const CATEGORY_ORDER = [
  'sportswear',
  'streetwear',
  'varsity-jacket',
  'activewear',
  'headwear',
  'workwear',
  'accessories',
]

const normalizeCategoryName = (category) => {
  return (
    category?.slug ||
    category?.name ||
    ''
  )
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
}

const sortHeroCategories = (categories) => {
  return [...categories].sort((a, b) => {
    const aName = normalizeCategoryName(a)
    const bName = normalizeCategoryName(b)

    const aIndex = CATEGORY_ORDER.findIndex(
      (item) =>
        aName === item ||
        aName.includes(item) ||
        item.includes(aName)
    )

    const bIndex = CATEGORY_ORDER.findIndex(
      (item) =>
        bName === item ||
        bName.includes(item) ||
        item.includes(bName)
    )

    return (
      (aIndex === -1 ? 999 : aIndex) -
      (bIndex === -1 ? 999 : bIndex)
    )
  })
}

function Hero({ categories = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isChanging, setIsChanging] = useState(false)

  const heroCategories = sortHeroCategories(categories)

  /*
   * Keep active index valid
   */
  useEffect(() => {
    if (
      heroCategories.length > 0 &&
      activeIndex >= heroCategories.length
    ) {
      setActiveIndex(0)
    }
  }, [heroCategories.length, activeIndex])

  /*
   * Change image with animation
   */
  const changeCategory = (newIndex) => {
    if (heroCategories.length <= 1) return

    setIsChanging(true)

    setTimeout(() => {
      setActiveIndex(newIndex)
    }, 150)

    setTimeout(() => {
      setIsChanging(false)
    }, 700)
  }

  /*
   * Previous image
   */
  const handlePrevious = () => {
    const newIndex =
      (activeIndex - 1 + heroCategories.length) %
      heroCategories.length

    changeCategory(newIndex)
  }

  /*
   * Next image
   */
  const handleNext = () => {
    const newIndex =
      (activeIndex + 1) %
      heroCategories.length

    changeCategory(newIndex)
  }

  /*
   * Automatic rotation
   */
  useEffect(() => {
    if (heroCategories.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      const newIndex =
        (activeIndex + 1) %
        heroCategories.length

      changeCategory(newIndex)
    }, 4200)

    return () => clearInterval(interval)

  }, [activeIndex, heroCategories.length])

  const activeCategory =
    heroCategories[activeIndex]

  /*
   * Current background image
   */
  const activeImage =
    withImageWidth(
      activeCategory?.heroImage?.url ||
      activeCategory?.collectionImage?.url ||
      '',
      1600
    )

  const backgroundImage =
    activeImage || heroAthlete

  return (
    <section
      className="hero-section"
      id="home"
    >
      {/* BACKGROUND IMAGE */}
      <img
        key={
          activeCategory?._id ||
          activeCategory?.slug ||
          activeCategory?.name ||
          'default-hero'
        }
        className={`hero-image ${
          isChanging ? 'changing' : ''
        }`}
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
      />

      {/* DARK OVERLAY */}
      <div className="hero-overlay" />

      {/* LEFT CONTENT */}
      <div className="hero-content">

        <p className="hero-meta">
          <span>Est. 2015</span>
          <span>Sialkot, Pakistan</span>
          <span>Ships Worldwide</span>
        </p>

        <h1>
          <span>Custom</span>

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

        {/* CURRENT CATEGORY */}
        {activeCategory && (
          <p className="category-strip">
            {activeCategory.name}
          </p>
        )}

      </div>

      {/* MANUAL CAROUSEL CONTROLS */}
      {heroCategories.length > 1 && (
        <div className="hero-carousel-controls">

          {/* PREVIOUS */}
          <button
            type="button"
            className="hero-carousel-arrow"
            onClick={handlePrevious}
            aria-label="Previous category"
          >
            ←
          </button>

          {/* DOTS */}
          <div className="hero-carousel-dots">
            {heroCategories.map((category, index) => (
              <button
                key={
                  category._id ||
                  category.slug ||
                  category.name ||
                  index
                }
                type="button"
                className={
                  index === activeIndex
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  changeCategory(index)
                }
                aria-label={`Go to ${
                  category.name
                }`}
              />
            ))}
          </div>

          {/* NEXT */}
          <button
            type="button"
            className="hero-carousel-arrow"
            onClick={handleNext}
            aria-label="Next category"
          >
            →
          </button>

        </div>
      )}

    </section>
  )
}

export default Hero