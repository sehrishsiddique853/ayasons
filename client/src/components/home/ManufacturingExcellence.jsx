
import factoryImage from '../../assets/images/ayosons-about-manufacturing.png'
const manufacturingStats = [
  {
    value: '10+',
    label: 'Years Experience',
  },
  {
    value: '2015_',
    label: 'Since',
  },
  {
    value: '150+',
    label: 'Skilled Professionals',
  },
]

const capabilities = [
  'Custom Product Development',
  'Cutting & Stitching',
  'Printing & Embroidery',
  'Quality Control',
]

function ManufacturingExcellence() {
  return (
    <section className="manufacturing-excellence" id="manufacturing">
      <div className="manufacturing-excellence-inner">

        <div className="manufacturing-excellence-content">
          <p className="manufacturing-kicker">
            Our Manufacturing
          </p>

          <h2>
            <span>Manufacturing</span>
            <span>Excellence</span>
            <span>Built For Brands.</span>
          </h2>

          <p className="manufacturing-intro">
            From initial product development to final packaging,
            our manufacturing process is built to deliver custom
            apparel with consistency, attention to detail and
            dependable production standards.
          </p>

          <p className="manufacturing-copy">
            Design, fabric selection, cutting, stitching, printing,
            embroidery, finishing and quality inspection are managed
            through a streamlined production process — helping brands
            turn their ideas into finished products.
          </p>

          <div className="manufacturing-capabilities">
            {capabilities.map((capability) => (
              <span key={capability}>
                {capability}
              </span>
            ))}
          </div>

          <div className="manufacturing-stats">
            {manufacturingStats.map((stat) => (
              <div
                className="manufacturing-stat"
                key={stat.label}
              >
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="manufacturing-button"
          >
            Explore Our Manufacturing
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="manufacturing-visual">
          <img
            src={factoryImage}
            alt="AYOSONS apparel manufacturing facility"
          />

          <div className="manufacturing-image-overlay" />

          <div className="manufacturing-media-label">
            <span>Inside AYOSONS</span>
            <strong>Our Production</strong>
          </div>

          <button
            className="manufacturing-play"
            type="button"
            aria-label="Play manufacturing video"
          >
            <span>▶</span>
          </button>

          <div className="manufacturing-image-number">
            01
          </div>
        </div>

      </div>
    </section>
  )
}

export default ManufacturingExcellence