import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import ayosonsLogo from '../../assets/logo/ayosons-logo-navbar-removebg-preview.png'
import { loadProductCategories } from '../../services/productCategoriesCache'
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
  const { totalQuantity } = useCart()

  const prepareProducts = () => loadProductCategories()

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
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            {...getPreloadProps(link.to)}
          >
            {link.label}
          </Link>
        ))}
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
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={
                link.to === '/products'
                  ? openProducts
                  : link.to === '/about'
                    ? openAbout
                    : () => setIsMenuOpen(false)
              }
              {...(link.to === '/products' || link.to === '/about'
                ? {
                    onPointerEnter: getPreloadProps(link.to).onPointerEnter,
                    onFocus: getPreloadProps(link.to).onFocus,
                  }
                : {})}
            >
              {link.label}
            </Link>
          ))}

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
