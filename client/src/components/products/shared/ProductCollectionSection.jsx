import '../../../style/products/ProductCollectionSection.css'

function ProductCollectionSection({
  title,
  description,
  image,
  groups = [],
  reverse = false,
}) {
  const normalizedGroups =
    groups.map((group) => {
      if (
        typeof group === 'string'
      ) {
        return {
          title: group,
          items: [],
        }
      }

      return {
        title:
          group.title ||
          group.name ||
          'Collection',

        items:
          Array.isArray(group.items)
            ? group.items
            : [],
      }
    })

  return (
    <section
      className={`product-collection ${
        reverse ? 'product-collection-reverse' : ''
      }`}
    >
      <div className="product-collection-image">
        <img
          src={image}
          alt={title}
        />

        <div className="product-collection-image-overlay" />
      </div>

      <div className="product-collection-content">

        <p className="product-collection-kicker">
          Collection
        </p>

        <h2>{title}</h2>

        <span
          className="product-collection-rule"
          aria-hidden="true"
        />

        <p className="product-collection-description">
          {description}
        </p>

        <div className="product-groups">

          {normalizedGroups.map((group) => (
            <div
              className="product-group"
              key={group.title}
            >
              <h3>{group.title}</h3>

              {group.items.length > 0 && (
                <div className="product-type-list">

                  {group.items.map((product) => (
                    <div
                      className="product-type-item"
                      key={product}
                    >
                      <span />

                      <strong>
                        {product}
                      </strong>
                    </div>
                  ))}

                </div>
              )}
            </div>
          ))}

        </div>

        <a
          className="product-category-button"
          href="#contact"
        >
          Enquire

          <span aria-hidden="true">
            →
          </span>
        </a>

      </div>
    </section>
  )
}

export default ProductCollectionSection
