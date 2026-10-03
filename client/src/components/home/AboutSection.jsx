import aboutImage
  from '../../assets/images/optimized/ayosons-industries-factory.webp'
import { Link } from 'react-router-dom'


const trustPoints = [
  'Custom Manufacturing',
  'Private Label',
  'Quality Control',
  'Global Supply',
]


function AboutSection({
  priority = false,
}) {
  return (
    <section
      className="about-section"
      id="about"
    >

      <div className="about-image-wrap">

        <img
          className="about-image"
          src={aboutImage}
          alt="AYOSONS apparel manufacturing facility"
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'low'}
        />

      </div>


      <div className="about-content">

        <p className="section-label">
          About AYOSONS
        </p>


        <h2>

          <span>
            From Sialkot
          </span>

          <span>
            To The World
          </span>

        </h2>


        <p>
          AYOSONS is a custom apparel
          and sportswear manufacturer
          producing sportswear,
          activewear, streetwear,
          jackets, headwear, workwear
          and accessories for brands,
          teams and businesses.
        </p>


        <p>
          From custom designs and
          fabric selection to branding,
          labels, packaging and
          production, AYOSONS supports
          buyers who need reliable
          manufacturing with a premium,
          export-ready finish.
        </p>


        <div className="trust-points">

          {trustPoints.map(
            (point) => (

              <span key={point}>
                {point}
              </span>

            )
          )}

        </div>


        <Link
          className="about-button"
          to="/manufacturing"
        >
          Learn More About Us
        </Link>

      </div>

    </section>
  )
}


export default AboutSection
