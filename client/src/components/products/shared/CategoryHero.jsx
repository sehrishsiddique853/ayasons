import '../../../style/products/CategoryHero.css'
function CategoryHero({
  eyebrow,
  title,
  description,
  image,
}) {
  return (
    <section
      className="product-category-hero"
      style={{
        '--category-hero-image': `url(${image})`,
      }}
    >
      <div className="product-category-hero-overlay" />

      <div className="product-category-hero-content">

        <p className="product-category-eyebrow">
          {eyebrow}
        </p>

        <h1>{title}</h1>

        <span
          className="product-category-accent"
          aria-hidden="true"
        />

        <p className="product-category-description">
          {description}
        </p>

      </div>
    </section>
  )
}

export default CategoryHero