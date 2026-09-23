import '../../style/BuyerTypesSection.css'

const buyerTypes = [
  {
    number: '01',
    title: 'Startups & Emerging Brands',
    description:
      'Custom apparel manufacturing for new and growing brands developing their first collections, samples and production runs.',
    link: 'For Startup Brands',
  },
  {
    number: '02',
    title: 'Clubs & Teams',
    description:
      'Custom teamwear and uniforms for football, cricket, rugby, basketball and other sports with consistent designs across every order.',
    link: 'For Clubs & Teams',
  },
  {
    number: '03',
    title: 'Academies, Schools & Universities',
    description:
      'Sportswear, training kits and custom apparel developed for educational institutions, academies and student teams.',
    link: 'For Institutions',
  },
  {
    number: '04',
    title: 'Gyms, Dojos & Studios',
    description:
      'Performance wear and branded fitness apparel for gyms, training studios, martial arts centers and activewear businesses.',
    link: 'For Fitness Brands',
  },
  {
    number: '05',
    title: 'Distributors & Resellers',
    description:
      'Flexible manufacturing solutions for wholesalers, distributors and resellers requiring dependable repeat production.',
    link: 'For Distributors',
  },
  {
    number: '06',
    title: 'Corporate & Workwear Buyers',
    description:
      'Custom workwear, jackets, uniforms and branded apparel created for companies, organizations and professional teams.',
    link: 'For Corporate Buyers',
  },
]

function BuyerTypesSection() {
  return (
    <section className="buyer-types-section">
      <div className="buyer-types-inner">

        <div className="buyer-types-header">

          <p className="buyer-types-kicker">
            Who We Manufacture For
          </p>

          <h2>
            <span>One Factory.</span>
            <span>Built For Every</span>
            <span>Buyer.</span>
          </h2>

          <p className="buyer-types-intro">
            From emerging brands and sports teams to distributors
            and corporate buyers, AYOSONS provides flexible custom
            manufacturing solutions for different business needs.
          </p>

        </div>

        <div className="buyer-types-grid">
          {buyerTypes.map((buyer) => (
            <article
              className="buyer-type-card"
              key={buyer.number}
            >
              <span className="buyer-type-number">
                {buyer.number}
              </span>

              <div className="buyer-type-content">
                <h3>{buyer.title}</h3>

                <span
                  className="buyer-type-rule"
                  aria-hidden="true"
                />

                <p>{buyer.description}</p>

                <a href="#contact">
                  {buyer.link}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="buyer-types-bottom">
          <p>
            Need something different? Tell us about your product,
            quantity and customization requirements.
          </p>

          <a
            href="#contact"
            className="buyer-types-button"
          >
            Start Your Project
            <span aria-hidden="true">→</span>
          </a>
        </div>

      </div>
    </section>
  )
}

export default BuyerTypesSection