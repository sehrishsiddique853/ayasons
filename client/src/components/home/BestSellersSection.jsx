import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import '../../style/BestSellersSection.css'

import api from '../../services/api'
import { withImageWidth } from '../../utils/imageUrl'
import { ProductCardSkeletons } from '../common/LoadingSkeletons'

function BestSellersSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(
          '/products?featured=true',
          {
            signal: controller.signal,
          }
        )

        setProducts(
          (response.data.products || [])
            .slice(0, 8)
        )
      } catch (error) {
        if (error.code === 'ERR_CANCELED') {
          return
        }

        console.error(
          'Failed to load Hot Selling products:',
          error
        )

        setError(
          'Hot Selling products could not be loaded right now.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      controller.abort()
    }
  }, [])

  const rows = useMemo(() => {
    const firstRow = products.slice(0, 4)
    const secondRow = products.slice(4, 8)

    return [
      firstRow,
      secondRow,
    ]
  }, [products])

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
            Our most requested custom products, selected from the admin panel.
          </p>
        </div>

        {loading && (
          <ProductCardSkeletons />
        )}

        {!loading && error && (
          <div className="best-sellers-state best-sellers-state-error">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="best-sellers-state">
            No Hot Selling products selected yet. Choose 8 products from the admin panel.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="best-sellers-marquee">
            {rows.map((rowProducts, rowIndex) => (
              rowProducts.length > 0 && (
                <div
                  className={
                    rowIndex === 0
                      ? 'best-sellers-row best-sellers-row-left'
                      : 'best-sellers-row best-sellers-row-right'
                  }
                  key={`hot-selling-row-${rowIndex}`}
                >
                  <div className="best-sellers-track">
                    {[...rowProducts, ...rowProducts].map((product, index) => (
                      <article
                        className="best-seller-card"
                        key={`${product.id}-${rowIndex}-${index}`}
                      >
                        <div className="best-seller-image-wrap">
                      <img
                        src={withImageWidth(
                          product.image?.url,
                          520
                        )}
                        alt={product.name}
                        className="best-seller-image"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                      />

                          <div className="best-seller-image-overlay" />

                          <div className="best-seller-card-top">
                            <span className="best-seller-brand">AYOSONS</span>
                            <span className="best-seller-category">
                              {product.category?.name || 'Product'}
                            </span>
                          </div>
                        </div>

                        <div className="best-seller-content">
                          <h3>{product.name}</h3>
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
              )
            ))}
          </div>
        )}

        <div className="best-sellers-footer">
          <p>
            Looking for something else? We also manufacture a wider range of custom apparel, accessories and performance products.
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
