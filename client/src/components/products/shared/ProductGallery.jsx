import '../../../style/products/ProductGallery.css'
import ProductCard from './ProductCard'
import { useState } from 'react'
import { Grid2X2, Square } from 'lucide-react'

function ProductGallery({
  eyebrow = 'Showcase',
  title = 'Product Gallery',
  products,
}) {
  const [cardLayout, setCardLayout] = useState('four')

  return (
    <section
      className="product-gallery-section"
      id="product-gallery"
    >
      <div className="product-gallery-header">
        <p>{eyebrow}</p>

        <h2>{title}</h2>

        <span
          className="product-gallery-accent"
          aria-hidden="true"
        />
      </div>

      <div
        className="product-gallery-layout-toggle"
        role="group"
        aria-label="Product card layout"
      >
        <button
          type="button"
          className={cardLayout === 'single' ? 'active' : ''}
          aria-pressed={cardLayout === 'single'}
          aria-label="Show one product card per row"
          title="Single card view"
          onClick={() => setCardLayout('single')}
        >
          <Square size={17} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={cardLayout === 'four' ? 'active' : ''}
          aria-pressed={cardLayout === 'four'}
          aria-label="Show four product cards"
          title="Four card view"
          onClick={() => setCardLayout('four')}
        >
          <Grid2X2 size={17} aria-hidden="true" />
        </button>
      </div>

      <div className={`product-gallery-grid product-gallery-grid--${cardLayout}`}>
        {products.map((product, index) => (
          <ProductCard
            key={product.title}
            priority={index < 4}
            {...product}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductGallery
