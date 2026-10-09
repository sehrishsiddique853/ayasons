import '../../../style/products/ProductCollectionSection.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function ProductCollectionSection({
  title,
  description,
  image,
  groups = [],
  reverse = false,
}) {
  const [expandedGroups, setExpandedGroups] = useState(() => new Set())

  const normalizedGroups = groups.length > 0 &&
    groups.every((group) => typeof group === 'string')
    ? [{ title: '', items: groups, isFlat: true }]
    : groups.map((group) => {
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
          loading="lazy"
          decoding="async"
          fetchPriority="low"
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

          {normalizedGroups.map((group, groupIndex) => {
            const groupKey = `${group.title}-${groupIndex}`
            const isExpanded = expandedGroups.has(groupKey)

            return (
            <div
              className={`product-group ${group.isFlat ? 'product-group--flat' : ''} ${isExpanded ? 'product-group--expanded' : 'product-group--collapsed'}`}
              key={groupKey}
            >
              {group.title && <h3>{group.title}</h3>}

              {group.items.length > 0 && (
                <div className="product-type-list">

                  {group.items.map((product, itemIndex) => (
                    <div
                      className={`product-type-item ${itemIndex >= 3 ? 'product-type-item--extra' : ''}`}
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

              {group.items.length > 3 && (
                <button
                  className="product-group-toggle"
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => {
                    setExpandedGroups((current) => {
                      const next = new Set(current)
                      if (next.has(groupKey)) {
                        next.delete(groupKey)
                      } else {
                        next.add(groupKey)
                      }
                      return next
                    })
                  }}
                >
                  {isExpanded ? 'Read less' : `Read more (${group.items.length - 3})`}
                </button>
              )}
            </div>
            )
          })}

        </div>

        <Link
          className="product-category-button"
          to="/contact"
        >
          Enquire

          <span aria-hidden="true">
            →
          </span>
        </Link>

      </div>
    </section>
  )
}

export default ProductCollectionSection
