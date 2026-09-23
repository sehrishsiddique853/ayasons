import { useEffect, useState } from 'react'

import heroAthlete from '../../assets/images/hero1.png'

import sportsImage from '../../assets/images/category-sports-teamwear.png'
import streetwearImage from '../../assets/images/category-lifestyle-accessories.png'
import activewearImage from '../../assets/images/category-performance-wear.png'
import varsityImage from '../../assets/images/versity_jackets.png'
import headwearImage from '../../assets/images/headwear.png'
import workwearImage from '../../assets/images/workwear.png'
import accessoriesImage from '../../assets/images/accessories.png'

const categories = [
  {
    name: 'Sports Wear',
    label: 'Team & Performance',
    image: sportsImage,
  },
  {
    name: 'Streetwear',
    label: 'Lifestyle Apparel',
    image: streetwearImage,
  },
  {
    name: 'Activewear',
    label: 'Gym & Fitness',
    image: activewearImage,
  },
  {
    name: 'Varsity Jackets',
    label: 'Premium Outerwear',
    image: varsityImage,
  },
  {
    name: 'Headwear',
    label: 'Custom Headwear',
    image: headwearImage,
  },
  {
    name: 'Workwear',
    label: 'Professional Apparel',
    image: workwearImage,
  },
  {
    name: 'Accessories',
    label: 'Bags & Accessories',
    image: accessoriesImage,
  },
]

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeCategory = categories[activeIndex]

  const goNext = () => {
    setActiveIndex(
      (current) => (current + 1) % categories.length
    )
  }

  const goPrevious = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + categories.length) %
        categories.length
    )
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduceMotion) {
      return undefined
    }

    const interval = window.setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % categories.length
      )
    }, 4200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="hero-section" id="home">

      {/* ORIGINAL HERO BACKGROUND */}
      <div className="hero-overlay" />

      <img
        className="hero-image"
        src={heroAthlete}
        alt=""
        aria-hidden="true"
      />

      {/* LEFT SIDE */}
      <div className="hero-content ">

        <p className="hero-meta">
          <span>Est. 2005</span>
          <span>Sialkot, Pakistan</span>
          <span>Ships Worldwide</span>
        </p>

        <h1>
          <span>Custom</span>
          <span>Sportswear and Streetwear</span>
          <span>Manufacturer</span>
        </h1>

        <p className="eyebrow">
          in Sialkot, Pakistan
        </p>

        <p className="hero-copy">
          Your manufacturing partner for sportswear,
          streetwear, activewear, workwear and private-label
          apparel — built for brands, teams and businesses.
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

        <p className="category-strip">
          Sportswear <span>•</span>
          Activewear <span>•</span>
          Streetwear <span>•</span>
          Workwear
        </p>

      </div>

      {/* ONLY THE HIGHLIGHTED RIGHT AREA */}
      <div className="hero-category-showcase " >

        <div className="hero-showcase-heading">
          <span>Explore Categories</span>

          <span >
            {String(activeIndex + 1).padStart(2, '0')}
            {' / '}
            {String(categories.length).padStart(2, '0')}
          </span>
        </div>

        <article
          className="hero-showcase-card"
          key={activeCategory.name}
        >
          <img
            src={activeCategory.image}
            alt={activeCategory.name}
          />

          <div className="hero-showcase-card-overlay" />

          <div className="hero-showcase-card-content">
            <span>
              {activeCategory.label}
            </span>

            <h2>
              {activeCategory.name}
            </h2>

            
          </div>

          <div className="hero-carousel-controls">

            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous category"
            >
              ←
            </button>

            <div className="hero-carousel-dots">
              {categories.map((category, index) => (
                <button
                  type="button"
                  key={category.name}
                  className={
                    index === activeIndex
                      ? 'active'
                      : ''
                  }
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${category.name}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next category"
            >
              →
            </button>

          </div>
        </article>

        <div className="hero-showcase-progress">
          <span key={activeCategory.name} />
        </div>

      </div>

    </section>
  )
}

export default Hero