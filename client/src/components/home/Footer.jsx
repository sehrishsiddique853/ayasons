import ayosonsLogo from '../../assets/logo/ayosons-logo-navbar-removebg-preview.png'
import fbrLogo from '../../assets/images/fbr-logo.png'
import scciLogo from '../../assets/images/Sialkot-Chamber-of-Commerce-038-Industries-Logo.png'

import '../../style/Footer.css'


import facebookIcon from '../../assets/icons/communication.png'
import linkedinIcon from '../../assets/icons/linkedin.png'
import whatsappIcon from '../../assets/icons/whatsapp.png'
import instagramIcon from '../../assets/icons/instagram.png'
import { useContactSettings } from '../../context/contactSettings'
import { Link, useNavigate } from 'react-router-dom'
import { loadProductCategory } from '../../services/productCategoryCache'


const socialLinkConfig = [
  {
    name: 'Facebook',
    icon: facebookIcon,
    field: 'facebook',
  },
  {
    name: 'LinkedIn',
    icon: linkedinIcon,
    field: 'linkedin',
  },
  {
    name: 'WhatsApp',
    icon: whatsappIcon,
    field: 'whatsapp',
  },
  {
    name: 'Instagram',
    icon: instagramIcon,
    field: 'instagram',
  },
]

function Footer() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const contactSettings = useContactSettings()
  const whatsappHref = contactSettings.whatsapp
    ? `https://wa.me/${contactSettings.whatsapp.replace(/\D/g, '')}`
    : ''
  const socialLinks = socialLinkConfig
    .map((social) => ({
      ...social,
      href: social.field === 'whatsapp'
        ? whatsappHref
        : contactSettings[social.field],
    }))
    .filter((social) => social.href)

  const prepareCategory = (slug) =>
    loadProductCategory(slug)

  const openCategory = async (event, slug) => {
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
      await prepareCategory(slug)
    } catch {
      // Let the destination render its standard error state.
    }

    navigate(`/products/${slug}`)
  }

  const productLinkProps = (slug) => ({
    to: `/products/${slug}`,
    onPointerEnter: () => prepareCategory(slug).catch(() => {}),
    onFocus: () => prepareCategory(slug).catch(() => {}),
    onClick: (event) => openCategory(event, slug),
  })

  return (
    <footer className="site-footer">

      <div className="footer-main">

        <div className="footer-brand">

          <Link to="/#home" className="footer-logo">
            <img
              src={ayosonsLogo}
              alt="AYOSONS Industries"
              loading="lazy"
              decoding="async"
            />
          </Link>

          <p>
            Custom sportswear, streetwear, activewear,
            safety and workwear, and private-label manufacturing
            for brands, teams and businesses worldwide.
          </p>

        </div>


        <div className="footer-navigation">

          <p className="footer-title">
            Quick Links
          </p>

          <Link to="/#home">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/manufacturing">Manufacturing</Link>
          <Link to="/contact">Request A Quote</Link>

        </div>


        <div className="footer-products">

          <p className="footer-title">
            Products
          </p>

          <Link {...productLinkProps('sportswear')}>Sports Wear</Link>
          <Link {...productLinkProps('streetwear')}>Streetwear</Link>
          <Link {...productLinkProps('activewear')}>Activewear</Link>
          <Link {...productLinkProps('varsity-jackets')}>Varsity Jackets</Link>
          <Link {...productLinkProps('headwear')}>Headwear</Link>
          <Link {...productLinkProps('workwear')}>Safety and Workwear</Link>
          <Link {...productLinkProps('accessories')}>Accessories</Link>

        </div>


        <div className="footer-connect">

          <p className="footer-title">
            Connect With Us
          </p>

          <div className="footer-socials">

            {socialLinks.map((social) => (
              <a
                href={social.href}
                key={social.name}
                target="_blank"
                rel="noreferrer"
                aria-label={social.name}
                title={social.name}
              >
                <img
                  src={social.icon}
                  alt={social.name}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}

          </div>

          <div className="footer-contact-details">
            {contactSettings.phone ? (
              <a href={`tel:${contactSettings.phone.replace(/[^+\d]/g, '')}`}>
                {contactSettings.phone}
              </a>
            ) : null}

            {contactSettings.email ? (
              <a href={`mailto:${contactSettings.email}`}>
                {contactSettings.email}
              </a>
            ) : null}
          </div>

        </div>

      </div>


      <div className="footer-registration">

        <div className="footer-registration-heading">

          <span>
            Registrations & Memberships
          </span>

          <h3>
            Business Credentials
          </h3>

        </div>


        <div className="footer-registration-logos">

          <div className="footer-registration-item">

            <div className="footer-registration-image">
              <img
                src={fbrLogo}
                alt="Federal Board of Revenue"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div>
              <span>Registered With</span>

              <strong>
                Federal Board of Revenue
              </strong>
            </div>

          </div>


          <div className="footer-registration-item">

  <div className="footer-registration-image footer-registration-image--chamber">
    <img
      src={scciLogo}
      alt="Sialkot Chamber of Commerce"
      className="footer-registration-logo--chamber"
      loading="lazy"
      decoding="async"
    />
  </div>

  <div>
    <span>Member Of</span>

    <strong>
      Sialkot Chamber of Commerce
    </strong>
  </div>

</div>

        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © {currentYear} AYOSONS Industries.
          All rights reserved.
        </p>

        <p>
          Sialkot, Pakistan
        </p>

      </div>

    </footer>
  )
}

export default Footer
