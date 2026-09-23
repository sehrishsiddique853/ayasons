import '../../style/BestSellersSection.css'

import sportsImage from '../../assets/images/category-sports-teamwear.png'
import performanceImage from '../../assets/images/category-performance-wear.png'
import lifestyleImage from '../../assets/images/category-lifestyle-accessories.png'

const rowOneProducts = [
  {
    brand: 'AYOSONS',
    category: 'Sportswear',
    title: 'Football Match Jerseys',
    description:
      'Custom football match jerseys developed for clubs, teams and sportswear brands.',
    image: sportsImage,
  },
  {
    brand: 'AYOSONS',
    category: 'Combat Wear',
    title: 'Boxing Shorts',
    description:
      'High-performance boxing shorts with custom colors, logos and branding.',
    image: performanceImage,
  },
  {
    brand: 'AYOSONS',
    category: 'Fitnesswear',
    title: 'Leggings',
    description:
      'Premium custom leggings for activewear brands, studios and fitness collections.',
    image: performanceImage,
  },
  {
    brand: 'AYOSONS',
    category: 'Sportswear',
    title: 'Reversible Jerseys',
    description:
      'Custom reversible jerseys made for basketball and training apparel ranges.',
    image: sportsImage,
  },
  {
    brand: 'AYOSONS',
    category: 'Motowear',
    title: 'Motocross Jerseys',
    description:
      'Durable motocross jerseys produced for teams, riders and sportswear buyers.',
    image: sportsImage,
  },
]

const rowTwoProducts = [
  {
    brand: 'AYOSONS',
    category: 'Fitnesswear',
    title: 'Sports Bras',
    description:
      'Supportive sports bras designed for gym, training and activewear collections.',
    image: performanceImage,
  },
  {
    brand: 'AYOSONS',
    category: 'Fitnesswear',
    title: 'Gym T-Shirts',
    description:
      'Performance gym t-shirts developed for brands, studios and training use.',
    image: performanceImage,
  },
  {
    brand: 'AYOSONS',
    category: 'Accessories',
    title: 'Kit Bags',
    description:
      'Custom kit bags and duffle bags built with durable materials and strong finishing.',
    image: lifestyleImage,
  },
  {
    brand: 'AYOSONS',
    category: 'Combat Wear',
    title: 'Rash Guards',
    description:
      'Custom rash guards for combat wear, MMA and training apparel collections.',
    image: sportsImage,
  },
  {
    brand: 'AYOSONS',
    category: 'Dancewear',
    title: 'Leotards',
    description:
      'Custom leotards created for dance, active performancewear and studio use.',
    image: performanceImage,
  },
]

function BestSellersSection() {
  return (
    <section className="best-sellers-section" id="best-sellers">
      <div className="best-sellers-inner">
        <div className="best-sellers-header">
          <p className="best-sellers-kicker">Best Sellers</p>

          <h2>
            <span>Hot Selling</span>
            <span>Products</span>
          </h2>

          <p className="best-sellers-intro">
            Our most requested custom products — developed for brands,
            teams and businesses looking for reliable manufacturing
            and repeat-order consistency.
          </p>
        </div>

        <div className="best-sellers-marquee">
          <div className="best-sellers-row best-sellers-row-left">
            <div className="best-sellers-track">
              {[...rowOneProducts, ...rowOneProducts].map((product, index) => (
                <article
                  className="best-seller-card"
                  key={`${product.title}-top-${index}`}
                >
                  <div className="best-seller-image-wrap">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="best-seller-image"
                    />

                    <div className="best-seller-image-overlay" />

                    <div className="best-seller-card-top">
                      <span className="best-seller-brand">{product.brand}</span>
                      <span className="best-seller-category">{product.category}</span>
                    </div>
                  </div>

                  <div className="best-seller-content">
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>

                    <a href="#contact" className="best-seller-link">
                      View
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="best-sellers-row best-sellers-row-right">
            <div className="best-sellers-track">
              {[...rowTwoProducts, ...rowTwoProducts].map((product, index) => (
                <article
                  className="best-seller-card"
                  key={`${product.title}-bottom-${index}`}
                >
                  <div className="best-seller-image-wrap">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="best-seller-image"
                    />

                    <div className="best-seller-image-overlay" />

                    <div className="best-seller-card-top">
                      <span className="best-seller-brand">{product.brand}</span>
                      <span className="best-seller-category">{product.category}</span>
                    </div>
                  </div>

                  <div className="best-seller-content">
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>

                    <a href="#contact" className="best-seller-link">
                      View
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="best-sellers-footer">
          <p>
            Looking for something else? We also manufacture a wider
            range of custom apparel, accessories and performance products.
          </p>

          <a href="#products" className="best-sellers-button">
            Explore All Products
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default BestSellersSection