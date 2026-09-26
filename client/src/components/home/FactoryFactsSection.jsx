import '../../style/FactoryFactsSection.css'

const factoryFacts = [
  {
    label: 'Company',
    value: 'AYOSONS Industries — custom apparel manufacturer and exporter',
  },
  {
    label: 'Location',
    value: 'Sialkot, Pakistan',
  },
  {
    label: 'Experience',
    value: '10+ years of apparel manufacturing experience',
  },
  {
    label: 'Production',
    value: '40,000–50,000+ pieces monthly production capacity',
  },
  {
    label: 'Product Range',
    value:
      'Sportswear, activewear, streetwear, varsity jackets, headwear, workwear and accessories',
  },
  {
    label: 'Who We Manufacture For',
    value:
      'Brands, sports clubs, academies, gyms, distributors, resellers and corporate buyers',
  },
  {
    label: 'Customization',
    value:
      'Custom designs, fabrics, colors, logos, labels, printing, embroidery and packaging',
  },
  {
    label: 'Sampling',
    value:
      'Product sampling available before bulk manufacturing',
  },
  {
    label: 'Quality Control',
    value:
      'Products are inspected during production and before final packing',
  },
  {
    label: 'Shipping',
    value:
      'Worldwide order preparation and international shipping support',
  },
]

const promises = [
  {
    number: '01',
    title: 'Custom Product Development',
    description:
      'Products are developed according to your design, specification and branding requirements.',
  },
  {
    number: '02',
    title: 'Consistent Production',
    description:
      'Repeat orders follow approved specifications to maintain product consistency.',
  },
  {
    number: '03',
    title: 'Your Brand, Your Identity',
    description:
      'Custom labels, logos, colors and packaging help keep your branding consistent.',
  },
  {
    number: '04',
    title: 'Quality Inspection',
    description:
      'Products are reviewed for construction, finishing, measurements and overall quality.',
  },
  {
    number: '05',
    title: 'Flexible Manufacturing',
    description:
      'Different product categories and customization requirements can be managed under one manufacturing partner.',
  },
  {
    number: '06',
    title: 'Buyer Communication',
    description:
      'Clear communication throughout sampling, production and final order preparation.',
  },
]

function FactoryFactsSection() {
  return (
    <section className="factory-facts-section" id="factory-facts">
      <div className="factory-facts-inner">

        <div className="factory-facts-header">
          <p className="factory-facts-kicker">
            The Factory, In Facts
          </p>

          <h2>
            <span>AYOSONS</span>
            <span>At A Glance.</span>
          </h2>

          <p className="factory-facts-intro">
            A quick overview of our manufacturing capabilities,
            product range and services for buyers looking to understand
            how AYOSONS operates.
          </p>
        </div>

        <div className="factory-facts-panel">
          <div className="factory-facts-panel-head">
            <span>Factory Profile</span>
            <strong>Buyer Information</strong>
          </div>

          <div className="factory-facts-list">
            {factoryFacts.map((fact) => (
              <div
                className="factory-fact-row"
                key={fact.label}
              >
                <span className="factory-fact-label">
                  {fact.label}
                </span>

                <p>{fact.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="buyer-promises-header">
          <div>
            <p className="buyer-promises-label">
              What Buyers Can Expect
            </p>

            <h3>
              Six Standards We Aim To Maintain
            </h3>
          </div>

          <p>
            From product development to final packing, these principles
            guide how we approach every custom manufacturing project.
          </p>
        </div>

        <div className="buyer-promises-grid">
          {promises.map((promise) => (
            <article
              className="buyer-promise"
              key={promise.number}
            >
              <div className="buyer-promise-icon">
                ✓
              </div>

              <div className="buyer-promise-content">
                <span>{promise.number}</span>

                <h4>{promise.title}</h4>

                <p>{promise.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="factory-facts-footer">
          <p>
            Need detailed specifications, production information or
            customization options for your project?
          </p>

          <a
            href="#contact"
            className="factory-facts-button"
          >
            Talk To Our Team
            <span aria-hidden="true">→</span>
          </a>
        </div>

      </div>
    </section>
  )
}

export default FactoryFactsSection