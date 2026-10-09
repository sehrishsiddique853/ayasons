import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Menu, ShoppingBag, X } from 'lucide-react'
import ayosonsLogo from '../../assets/logo/ayosons-logo-navbar-removebg-preview.png'
import { loadProductCategories } from '../../services/productCategoriesCache'
import { loadProductList } from '../../services/productListCache'
import { loadHomepageContent } from '../../services/homepageContentCache'
import { useCart } from '../../context/CartContext'

const navLinks = [
  { label: 'Home', to: '/#home' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Manufacturing', to: '/manufacturing' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  const [megaCategories, setMegaCategories] = useState([])
  const [megaLoading, setMegaLoading] = useState(false)
  const productsLoadRef = useRef(null)
  const { totalQuantity } = useCart()

  const prepareProducts = () => {
    if (productsLoadRef.current) {
      return productsLoadRef.current
    }

    if (
      megaCategories.length > 0 &&
      megaCategories.every((category) => category.productsLoaded)
    ) {
      return Promise.resolve(megaCategories)
    }

    productsLoadRef.current = (async () => {
      setMegaLoading(true)

      try {
        const categories = await loadProductCategories()

        setMegaCategories(
          categories.map((category) => ({
            ...category,
            products: [],
            productsLoaded: false,
          }))
        )

        const products = await loadProductList()
        const productsByCategory = new Map(
          categories.map((category) => [category.slug, []])
        )

        for (const product of products) {
          const categorySlug = product.category?.slug
          if (productsByCategory.has(categorySlug)) {
            productsByCategory.get(categorySlug).push(product)
          }
        }

        const detailedCategories = categories.map((category) => ({
          ...category,
          products: productsByCategory.get(category.slug) || [],
          productsLoaded: true,
        }))

        setMegaCategories(detailedCategories)

        return detailedCategories
      } catch (error) {
        // Leave category links available if product details fail to load.
        setMegaCategories((current) =>
          current.map((category) => ({
            ...category,
            productsLoaded: true,
          }))
        )
        throw error
      } finally {
        setMegaLoading(false)
        productsLoadRef.current = null
      }
    })()

    return productsLoadRef.current
  }

  const openProducts = (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return

    event.preventDefault()

    setIsMenuOpen(false)
    navigate('/products')
    prepareProducts().catch(() => {})
  }

  const prepareAbout = () => loadHomepageContent()

  const openAbout = (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return

    event.preventDefault()

    setIsMenuOpen(false)
    navigate('/about')
    prepareAbout().catch(() => {})
  }

  const getPreloadProps = (path) => {
    if (path === '/products') {
      return {
        onPointerEnter: () => prepareProducts().catch(() => {}),
        onFocus: () => prepareProducts().catch(() => {}),
        onClick: openProducts,
      }
    }

    if (path === '/about') {
      return {
        onPointerEnter: () => prepareAbout().catch(() => {}),
        onFocus: () => prepareAbout().catch(() => {}),
        onClick: openAbout,
      }
    }

    return {}
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/#home" aria-label="AYOSONS home">
        <img
          className="brand-logo"
          src={ayosonsLogo}
          alt="AYOSONS Industries"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {navLinks.map((link) =>
          link.to === '/products' ? (
            <div
              className="nav-products-menu"
              key={link.label}
            >
              <button
                className="nav-products-trigger"
                type="button"
                aria-haspopup="true"
                aria-expanded={isProductsOpen}
                onPointerEnter={() => prepareProducts().catch(() => {})}
                onFocus={() => prepareProducts().catch(() => {})}
                onClick={() => {
                  setIsProductsOpen((open) => !open)
                  prepareProducts().catch(() => {})
                }}
              >
                {link.label}
                <ChevronDown
                  size={15}
                  className={isProductsOpen ? 'is-open' : ''}
                />
              </button>

              {isProductsOpen && (
                <div className="nav-mega-menu">
                  <div className="nav-mega-inner">
                    {megaLoading && !megaCategories.length ? (
                      <div className="nav-mega-loading">
                        Loading products...
                      </div>
                    ) : (
                      megaCategories.map((category) => (
                        <section
                          className="nav-mega-column"
                          key={category.id || category.slug}
                        >
                          <Link
                            className="nav-mega-heading"
                            to={`/products/${category.slug}`}
                            onClick={() => setIsProductsOpen(false)}
                          >
                            {category.name}
                          </Link>

                          <div className="nav-mega-products">
                            {!category.productsLoaded && (
                              <span className="nav-mega-products-loading">
                                Loading products...
                              </span>
                            )}
                            {(category.products || []).map((product) => (
                              <Link
                                key={product.id || product.slug}
                                to={
                                  product.customizable
                                    ? `/products/${category.slug}/${product.slug}`
                                    : `/products/${category.slug}`
                                }
                                onClick={() => setIsProductsOpen(false)}
                              >
                                {product.name}
                              </Link>
                            ))}
                          </div>
                        </section>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              key={link.label}
              to={link.to}
              {...getPreloadProps(link.to)}
            >
              {link.label}
            </Link>
          )
        )}
      </nav>

      <div className="nav-actions">
        <Link
          className="nav-cart-button"
          to="/cart"
          aria-label={`Shopping cart with ${totalQuantity} items`}
        >
          <ShoppingBag size={20} />
          <span className="nav-cart-label">Cart</span>
          {totalQuantity > 0 && (
            <span className="nav-cart-count">{totalQuantity}</span>
          )}
        </Link>

        <Link className="quote-button" to="/contact">
          Request a Quote
        </Link>

        <button
          className="menu-button"
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {navLinks.map((link) =>
            link.to === '/products' ? (
              <div className="mobile-products-group" key={link.label}>
                <button
                  className="mobile-products-toggle"
                  type="button"
                  aria-expanded={isMobileProductsOpen}
                  onFocus={() => prepareProducts().catch(() => {})}
                  onClick={() => {
                    setIsMobileProductsOpen((open) => !open)
                    prepareProducts().catch(() => {})
                  }}
                >
                  <span>{link.label}</span>
                  <ChevronDown
                    size={17}
                    className={isMobileProductsOpen ? 'is-open' : ''}
                  />
                </button>

                {isMobileProductsOpen && (
                  <div className="mobile-products-panel">
                    <Link
                      className="mobile-products-all"
                      to="/products"
                      onClick={openProducts}
                    >
                      View All Products
                    </Link>

                    {megaCategories.map((category) => (
                      <div
                        className="mobile-products-category"
                        key={category.id || category.slug}
                      >
                        <Link
                          to={`/products/${category.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category.name}
                        </Link>

                        <div>
                          {!category.productsLoaded && (
                            <span className="nav-mega-products-loading">
                              Loading products...
                            </span>
                          )}
                          {(category.products || []).map((product) => (
                            <Link
                              key={product.id || product.slug}
                              to={
                                product.customizable
                                  ? `/products/${category.slug}/${product.slug}`
                                  : `/products/${category.slug}`
                              }
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {product.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                onClick={
                  link.to === '/about'
                    ? openAbout
                    : () => setIsMenuOpen(false)
                }
                {...(link.to === '/about'
                  ? {
                      onPointerEnter: getPreloadProps(link.to).onPointerEnter,
                      onFocus: getPreloadProps(link.to).onFocus,
                    }
                  : {})}
              >
                {link.label}
              </Link>
            )
          )}

          <Link
            className="mobile-cart"
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingBag size={18} />
            Cart
            {totalQuantity > 0 && <span>{totalQuantity}</span>}
          </Link>

          <Link
            className="mobile-quote"
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
          >
            Request a Quote
          </Link>
        </nav>
      )}
    </header>
  )
}

export default Navbar
