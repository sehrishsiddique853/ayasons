import ayosonsLogo from '../../assets/logo/ayosons-logo-navbar-removebg-preview.png'
import fbrLogo from '../../assets/images/fbr-logo.png'
import scciLogo from '../../assets/images/Sialkot-Chamber-of-Commerce-038-Industries-Logo.png'

import '../../style/Footer.css'


import facebookIcon from '../../assets/icons/communication.png'
import linkedinIcon from '../../assets/icons/linkedin.png'
import whatsappIcon from '../../assets/icons/whatsapp.png'
import instagramIcon from '../../assets/icons/instagram.png'


const socialLinks = [
  {
    name: 'Facebook',
    icon: facebookIcon,
    href: 'https://facebook.com/',
  },
  {
    name: 'LinkedIn',
    icon: linkedinIcon,
    href: 'https://linkedin.com/',
  },
  {
    name: 'WhatsApp',
    icon: whatsappIcon,
    href: 'https://wa.me/92XXXXXXXXXX',
  },
  {
    name: 'Instagram',
    icon: instagramIcon,
    href: 'https://instagram.com/',
  },
]

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">

      <div className="footer-main">

        <div className="footer-brand">

          <a href="#home" className="footer-logo">
            <img
              src={ayosonsLogo}
              alt="AYOSONS Industries"
              loading="lazy"
              decoding="async"
            />
          </a>

          <p>
            Custom sportswear, streetwear, activewear,
            workwear and private-label manufacturing
            for brands, teams and businesses worldwide.
          </p>

        </div>


        <div className="footer-navigation">

          <p className="footer-title">
            Quick Links
          </p>

          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#manufacturing">Manufacturing</a>
          <a href="#contact">Request A Quote</a>

        </div>


        <div className="footer-products">

          <p className="footer-title">
            Products
          </p>

          <a href="#products">Sports Wear</a>
          <a href="#products">Streetwear</a>
          <a href="#products">Activewear</a>
          <a href="#products">Varsity Jackets</a>
          <a href="#products">Headwear</a>
          <a href="#products">Workwear</a>
          <a href="#products">Accessories</a>

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
