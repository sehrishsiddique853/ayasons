import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link } from 'react-router-dom'

import '../../style/BestSellersSection.css'

import api from '../../services/api'
import { withImageWidth } from '../../utils/imageUrl'
import { ProductCardSkeletons } from '../common/LoadingSkeletons'

const getCategoryPath = (product) => {
  const categorySlug =
    product.category?.slug ||
    product.category?.name ||
    ''

  const normalizedSlug = categorySlug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalizedSlug
    ? `/products/${normalizedSlug}`
    : '/products'
}

function BestSellersSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadProducts = async ({ background = false } = {}) => {
      try {
        if (!background) {
          setLoading(true)
          setError('')
        }

        const response = await api.get(
          '/products',
          {
            signal: controller.signal,
            params: {
              featured: true,
              updatedAt: Date.now(),
            },
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

        if (!background) {
          setError(
            'Hot Selling products could not be loaded right now.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        loadProducts({ background: true })
      }
    }

    document.addEventListener(
      'visibilitychange',
      refreshWhenVisible
    )

    return () => {
      controller.abort()
      document.removeEventListener(
        'visibilitychange',
        refreshWhenVisible
      )
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
            Our most requested custom products.
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
                      <Link
                        className="best-seller-card"
                        to={getCategoryPath(product)}
                        key={`${product.id}-${rowIndex}-${index}`}
                        aria-label={`View ${product.category?.name || 'product'} category`}
                        aria-hidden={index >= rowProducts.length}
                        tabIndex={index >= rowProducts.length ? -1 : 0}
                      >
                        <div className="best-seller-image-wrap">
                      <img
                        src={withImageWidth(
                          product.image?.url,
                          520
                        )}
                        alt={product.name}
                        className="best-seller-image"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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

                          
                        </div>
                      </Link>
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

          <Link to="/products" className="best-sellers-button">
            Explore All Products
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BestSellersSection
