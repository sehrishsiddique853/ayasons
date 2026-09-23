import '../../style/FactoryDirectSection.css'

const comparisonRows = [
  {
    label: 'Who makes the product',
    ayosons: 'Direct manufacturing through AYOSONS production',
    intermediary: 'Production may be handled by a third-party supplier',
    marketplace: 'Seller or reseller may not manufacture directly',
  },
  {
    label: 'Product development',
    ayosons: 'Direct communication around design, materials and specifications',
    intermediary: 'Requirements may pass through an additional contact',
    marketplace: 'Usually based on standard catalogue listings',
  },
  {
    label: 'Customization',
    ayosons: 'Custom colors, branding, labels, decoration and packaging',
    intermediary: 'Depends on the supplier being used',
    marketplace: 'Often limited to listed options',
  },
  {
    label: 'Sampling',
    ayosons: 'Sampling available before bulk production',
    intermediary: 'Depends on supplier process',
    marketplace: 'May not be available before purchase',
  },
  {
    label: 'Quality communication',
    ayosons: 'Manufacturing feedback handled directly with the production team',
    intermediary: 'Feedback may move through an agent',
    marketplace: 'Usually handled through platform messaging',
  },
  {
    label: 'Repeat orders',
    ayosons: 'Approved specifications can be reused for repeat manufacturing',
    intermediary: 'Consistency depends on the sourcing arrangement',
    marketplace: 'Product availability may change',
  },
]

const factoryAdvantages = [
  {
    number: '01',
    eyebrow: 'New Brands',
    title: 'Start With Your Own Product',
    description:
      'Develop custom sportswear, activewear and apparel around your branding instead of relying only on ready-made products.',
    link: 'Start Your Project',
  },
  {
    number: '02',
    eyebrow: 'Direct Production',
    title: 'Work Closer To Manufacturing',
    description:
      'Communicate product requirements more clearly by working with a manufacturing partner involved in the production process.',
    link: 'Our Manufacturing',
  },
  {
    number: '03',
    eyebrow: 'Made For Brands',
    title: 'Build For Repeat Orders',
    description:
      'Approved product specifications can form the foundation for future collections and repeat manufacturing.',
    link: 'Request A Quote',
  },
]

function FactoryDirectSection() {
  return (
    <section className="factory-direct-section" id="factory-direct">
      <div className="factory-direct-inner">

        <div className="factory-direct-header">
          <p className="factory-direct-kicker">
            Factory Direct
          </p>

          <h2>
            <span>Why Work Directly</span>
            <span>With The Factory?</span>
          </h2>

          <p className="factory-direct-intro">
            Direct manufacturing can give buyers clearer communication
            around product development, customization, sampling and
            repeat production.
          </p>
        </div>

        <div className="factory-comparison">
          <div className="factory-comparison-head">
            <div className="comparison-head-label">
              What Matters
            </div>

            <div className="comparison-head-ayosons">
              AYOSONS
              <span>Factory Direct</span>
            </div>

            <div>
              Typical
              <span>Intermediary</span>
            </div>

            <div>
              Typical
              <span>Marketplace</span>
            </div>
          </div>

          <div className="factory-comparison-body">
            {comparisonRows.map((row) => (
              <div
                className="factory-comparison-row"
                key={row.label}
              >
                <div className="comparison-label">
                  {row.label}
                </div>

                <div className="comparison-ayosons">
                  <span className="comparison-check">✓</span>
                  <p>{row.ayosons}</p>
                </div>

                <div className="comparison-muted">
                  <p>{row.intermediary}</p>
                </div>

                <div className="comparison-muted">
                  <p>{row.marketplace}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="factory-advantages-grid">
          {factoryAdvantages.map((item) => (
            <article
              className="factory-advantage-card"
              key={item.number}
            >
              <div className="factory-advantage-top">
                <span className="factory-advantage-number">
                  {item.number}
                </span>

                <span className="factory-advantage-eyebrow">
                  {item.eyebrow}
                </span>
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <a href="#contact">
                {item.link}
                <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FactoryDirectSection