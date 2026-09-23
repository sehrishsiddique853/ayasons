import '../../../style/products/ProductGallery.css'
import ProductCard from './ProductCard'

function ProductGallery({
  eyebrow = 'Showcase',
  title = 'Product Gallery',
  products,
}) {
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

      <div className="product-gallery-grid">
        {products.map((product) => (
          <ProductCard
            key={product.title}
            {...product}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductGallery