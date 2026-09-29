import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import ayosonsLogo from '../../assets/logo/ayosons-logo-navbar-removebg-preview.png'
import { loadProductCategories } from '../../services/productCategoriesCache'

const navLinks = [
  { label: 'Home', to: '/#home' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/#about' },
  { label: 'Manufacturing', to: '/manufacturing' },
  { label: 'Contact', to: '/contact' },
]

function Navbar() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const prepareProducts = () =>
    loadProductCategories()

  const openProducts = async (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()

    try {
      await prepareProducts()
    } catch {
      // The products page will render its normal error state.
    }

    setIsMenuOpen(false)
    navigate('/products')
  }

  const productsPreloadProps = {
    onPointerEnter: () => prepareProducts().catch(() => {}),
    onFocus: () => prepareProducts().catch(() => {}),
    onClick: openProducts,
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
            {...(link.to === '/products'
              ? productsPreloadProps
              : {})}
          >
            {link.label}
            {link.hasDropdown && <ChevronDown size={14} strokeWidth={2.5} />}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
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
          {isMenuOpen ? (
            <X size={24} strokeWidth={2.2} />
          ) : (
            <Menu size={24} strokeWidth={2.2} />
          )}
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
                  : () => setIsMenuOpen(false)
              }
              {...(link.to === '/products'
                ? {
                    onPointerEnter:
                      productsPreloadProps.onPointerEnter,
                    onFocus:
                      productsPreloadProps.onFocus,
                  }
                : {})}
            >
              {link.label}
            </Link>
          ))}
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
