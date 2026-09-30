import '../../style/manufacturing/ManufacturingIntroSection.css'

const fallbackStats = [
  { value: '150+', label: 'Skilled Professionals' },
  { value: '40K–50K+', label: 'Pieces Monthly Capacity' },
  { value: '06', label: 'Production Departments' },
  { value: '20+', label: 'Years Experience' },
]

const productionStages = [
  'Development',
  'Cutting',
  'Decoration',
  'Stitching',
  'Inspection',
  'Packing',
]

function ManufacturingIntroSection({ homepageContent }) {
  const stats =
    Array.isArray(homepageContent?.departmentStats) &&
    homepageContent.departmentStats.length === 4
      ? homepageContent.departmentStats
      : fallbackStats

  return (
    <section className="manufacturing-intro-hero">
      <div className="manufacturing-intro-copy">
        <p className="manufacturing-intro-kicker">
          <span aria-hidden="true" />
          Production &amp; Capabilities
        </p>

        <h1>
          <span>From Concept.</span>
          <span>Through Every</span>
          <span>Production Stage.</span>
        </h1>

        <p className="manufacturing-intro-description">
          Product development, cutting, decoration, stitching and quality
          inspection come together in one coordinated manufacturing process
          built for dependable custom apparel production.
        </p>

        <div
          className="manufacturing-intro-stages"
          aria-label="Manufacturing stages"
        >
          {productionStages.map((stage, index) => (
            <span key={stage}>
              <b>{String(index + 1).padStart(2, '0')}</b>
              {stage}
            </span>
          ))}
        </div>
      </div>

   
    </section>
  )
}

export default ManufacturingIntroSection
