import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import ayosonsLogo from '../../assets/logo/ayosons-logo-navbar-removebg-preview.png'

const navLinks = [
  { label: 'Home', to: '/#home' },
  { label: 'Products', to: '/#products' },
  { label: 'About', to: '/#about' },
  { label: 'Manufacturing', to: '/#manufacturing' },
  { label: 'Contact', to: '/#contact' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <Link className="brand" to="/#home" aria-label="AYOSONS home">
        <img className="brand-logo" src={ayosonsLogo} alt="AYOSONS Industries" />
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {navLinks.map((link) => (
          <Link key={link.label} to={link.to}>
            {link.label}
            {link.hasDropdown && <ChevronDown size={14} strokeWidth={2.5} />}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
        <Link className="quote-button" to="/#contact">
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
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className="mobile-quote"
            to="/#contact"
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
