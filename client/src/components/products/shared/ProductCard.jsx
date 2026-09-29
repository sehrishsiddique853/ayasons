import '../../../style/products/ProductCard.css'
import { Link } from 'react-router-dom'
import { withImageWidth } from '../../../utils/imageUrl'

function ProductCard({
  title,
  description,
  image,
  features,
}) {
  return (
    <article className="category-product-card">

      <div className="category-product-image">

        <img
          src={withImageWidth(
            image,
            520
          )}
          alt={title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />

        <div className="category-product-image-overlay" />

      </div>

      <div className="category-product-content">

        <h3>{title}</h3>

        <p>{description}</p>

        <div className="category-product-features">

          {features.map((feature, index) => (
            <span key={feature}>

              {feature}

              {index < features.length - 1 && (
                <i>•</i>
              )}

            </span>
          ))}

        </div>

        <Link
          className="category-product-button"
          to="/contact"
        >
          Request A Quote

          <span aria-hidden="true">
            →
          </span>
        </Link>

      </div>

    </article>
  )
}

export default ProductCard
