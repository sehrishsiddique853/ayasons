import sportsImage from '../../assets/images/category-sports-teamwear.png'
import performanceImage from '../../assets/images/category-performance-wear.png'
import lifestyleImage from '../../assets/images/category-lifestyle-accessories.png'
import headwearImage from '../../assets/images/headwear.png'
import workwearImage from '../../assets/images/workwear.png'
import varsityJacketImage from '../../assets/images/versity_jackets.png'
import accessoriesImage from '../../assets/images/accessories.png'

import { Link } from 'react-router-dom'


const categories = [
  {
    title: 'Activewear',
    description:
      'Designed for movement, comfort and everyday activity.',
    image: performanceImage,
    path: '/products/activewear',
  },
  {
    title: 'Sportswear',
    description:
      'Performance apparel for teams, athletes and sports.',
    image: sportsImage,
    path: '/products/sportswear',
  },
  {
    title: 'Streetwear',
    description:
      'Modern apparel combining sport, comfort and street culture.',
    image: lifestyleImage,
    path: '/products/streetwear',
  },
  {
    title: 'Workwear',
    description:
      'Professional apparel built for durability, comfort and performance.',
    image: workwearImage,
    path: '/products/workwear',
  },
  {
    title: 'Varsity Jackets',
    description:
      'Premium custom varsity jackets for brands, teams and collections.',
    image: varsityJacketImage,
    path: '/products/varsity-jackets',
  },
  {
    title: 'Headwear',
    description:
      'Custom caps and headwear designed for brands, teams and everyday wear.',
    image: headwearImage,
    path: '/products/headwear',
  },
  {
    title: 'Accessories',
    description:
      'Custom bags, socks and accessories built for performance and daily use.',
    image: accessoriesImage,
    path: '/products/accessories',
  },
]

function ManufactureSection() {
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
          <span>What We Manufacture</span>
        </h2>

        <div
          className="section-accent"
          aria-hidden="true"
        />

      </div>

      <div className="manufacture-grid">

        {categories.map((category, index) => (
          <Link
            className="manufacture-card"
            to={category.path}
            key={category.title}
            style={{
              '--card-image': `url(${category.image})`,
            }}
          >

            <span className="card-number">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="manufacture-card-content">

              <h3>{category.title}</h3>

              <span className="card-rule" />

              <p>
                {category.description}
              </p>

              <span className="manufacture-explore-button">
                Explore
                <span aria-hidden="true">
                  →
                </span>
              </span>

            </div>

          </Link>
        ))}

      </div>
    </section>
  )
}

export default ManufactureSection