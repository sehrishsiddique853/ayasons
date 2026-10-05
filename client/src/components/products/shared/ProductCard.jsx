import '../../../style/products/ProductCard.css'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { withImageWidth } from '../../../utils/imageUrl'

function ProductCard({
  title,
  description,
  image,
  features = [],
  to = '/contact',
  buttonText = 'Request A Quote',
}) {
  return (
    <article className="category-product-card">
      <Link className="category-product-image" to={to} aria-label={title}>
        <img
          src={withImageWidth(image, 520)}
          alt={title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </Link>

      <div className="category-product-content">
        <div className="category-product-topline">
          <span>AYOSONS</span>
          <span>Custom Manufacturing</span>
        </div>

        <h3>
          <Link to={to}>{title}</Link>
        </h3>

        <p>{description}</p>

        {features.length > 0 && (
          <div className="category-product-features">
            {features.slice(0, 3).map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
        )}

        <div className="category-product-footer">
          <span className="category-product-price">Price on request</span>

          <Link className="category-product-button" to={to}>
            <ShoppingBag size={16} />
            {buttonText}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
