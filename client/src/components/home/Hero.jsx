import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { withImageWidth } from '../../utils/imageUrl'
import heroLoadingFallback from '../../assets/images/optimized/hero-loading-fallback.webp'

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
  const [displayedImage, setDisplayedImage] = useState(
    heroLoadingFallback
  )

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
    activeImage

  const hasLoadedCarouselImage =
    displayedImage !== heroLoadingFallback

  /*
   * Keep the current background visible until the next one has fully
   * downloaded and decoded. This prevents a blank frame when API data
   * arrives or the carousel advances.
   */
  useEffect(() => {
    if (!backgroundImage) {
      return undefined
    }

    if (backgroundImage === displayedImage) {
      return undefined
    }

    let cancelled = false
    const nextImage = new Image()

    const showNextImage = async () => {
      try {
        await nextImage.decode()
      } catch {
        // The load event still confirms the image can be displayed.
      }

      if (!cancelled) {
        setDisplayedImage(backgroundImage)
      }
    }

    nextImage.addEventListener('load', showNextImage, {
      once: true,
    })
    nextImage.src = backgroundImage

    if (nextImage.complete) {
      showNextImage()
    }

    return () => {
      cancelled = true
      nextImage.removeEventListener('load', showNextImage)
    }
  }, [backgroundImage, displayedImage])

  return (
    <section
      className={`hero-section ${
        hasLoadedCarouselImage ? 'hero-section--ready' : ''
      }`}
      id="home"
    >
      {/* BACKGROUND IMAGE */}
      {displayedImage && (
        <img
          className={`hero-image ${
            isChanging ? 'changing' : ''
          }`}
          src={displayedImage}
          alt=""
          aria-hidden="true"
          decoding="sync"
          fetchPriority="high"
        />
      )}

      {/* DARK OVERLAY */}
      <div className="hero-overlay" />

      {/* LEFT CONTENT */}
      <div className="hero-content">

        <p className="hero-meta">
          <span>Est. 2015</span>
          <span>Sialkot, Pakistan</span>
          <span>Ships Worldwide</span>
        </p>

        <p className="eyebrow">
          Custom Sportswear and
        </p>
         <p className="eyebrow">
           Streetwear Manufacturer
        </p>
        

        <h1>
          <span className="hero-category-title">
            <span
              className="hero-category-title-text"
              key={
                activeCategory?.id ||
                activeCategory?._id ||
                activeCategory?.slug ||
                'sportswear'
              }
            >
              {activeCategory?.name || 'Sportswear'}
            </span>
          </span>
        </h1>

      

        <p className="hero-copy">
          Your manufacturing partner for sportswear,
          streetwear, activewear, workwear and
          private-label apparel — built for brands,
          teams and businesses.
        </p>

        <div className="hero-buttons">

          <Link
            className="primary-button"
            to="/products"
          >
            Explore Products
          </Link>

          <Link
            className="secondary-button"
            to="/contact"
          >
            Request a Quote
          </Link>

        </div>

      
         <p className="eyebrow">
          in Sialkot, Pakistan
        </p>

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
