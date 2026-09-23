import { Underline } from 'lucide-react'
import '../../style/StandardsSection.css'

const standards = [
  {
    icon: '🏅',
    title: 'ISO 9001:2015',
    description: 'Quality management system',
  },
  {
    icon: '♻',
    title: 'OEKO-TEX® Standard 100',
    description: 'Fabrics tested for harmful substances',
  },
  {
    icon: '🤝',
    title: 'BSCI Audited',
    description: 'Social compliance audit',
  },
  {
    icon: '🌱',
    title: 'GRS Options',
    description: 'Recycled polyester on request',
  },
  {
    icon: '🔬',
    title: 'SGS Testing',
    description: 'Third-party lab testing on request',
  },
  {
    icon: '✈',
    title: 'Export Licensed',
    description: 'Export-ready manufacturing support',
  },
]

function StandardsSection() {
  return (
    <section className="standards-section" id="standards">
      <div className="standards-inner">

        <div className="standards-header">
          <p className="standards-kicker">
             Certifications & Compliance
          </p>

          <h2>
            <span> Documentation Available On Request</span>
          </h2>
        </div>

        <div className="standards-grid">
          {standards.map((item) => (
            <article
              className="standard-card"
              key={item.title}
            >
              <div className="standard-icon">
                <span>{item.icon}</span>
              </div>

              <div className="standard-content">
                <h3>{item.title}</h3>

                <span
                  className="standard-rule"
                  aria-hidden="true"
                />

                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
  <div className="factory-facts-footer">
          <p>
            Verify before you order - we encourage it. Ask for certificate copies with your enquiry, book a live video tour on WhatsApp, and order a
            sample before bulk. Details on the certifications. quality control and about the factory pages.
          </p>

        </div>

      </div>
    </section>
  )
}

export default StandardsSection