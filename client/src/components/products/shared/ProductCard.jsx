import '../../../style/products/ProductCard.css'
import { Link } from 'react-router-dom'
import { withImageWidth } from '../../../utils/imageUrl'

function ProductCard({
  title,
  description,
  image,
  features = [],
  to = '/contact',
}) {
  return (
    <Link
      className="category-product-card"
      to={to}
      aria-label={`Open ${title}`}
    >
      <div className="category-product-image">
        <img
          src={withImageWidth(image, 520)}
          alt={title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </div>

      <div className="category-product-content">
        <div className="category-product-topline">
          <span>AYOSONS</span>
          <span>Custom Manufacturing</span>
        </div>

        <h3>{title}</h3>

        <p>{description}</p>

        {features.length > 0 && (
          <div className="category-product-features">
            {features.slice(0, 3).map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard
