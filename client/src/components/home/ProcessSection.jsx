import '../../style/ProcessSection.css'


import sportsImage from '../../assets/images/category-sports-teamwear.png'
import performanceImage from '../../assets/images/category-performance-wear.png'
import lifestyleImage from '../../assets/images/category-lifestyle-accessories.png'

const processSteps = [
  {
    number: '01',
    title: 'Design & Mockup',
    description:
      'Initial concept, colors, branding and visual direction are prepared before production starts.',
    image: lifestyleImage,
  },
  {
    number: '02',
    title: 'Approval & Sampling',
    description:
      'Samples are reviewed for sizing, look, material feel and overall product approval.',
    image: performanceImage,
  },
  {
    number: '03',
    title: 'Pattern & Cutting',
    description:
      'Approved products move into pattern development and precise cutting preparation.',
    image: sportsImage,
  },
  {
    number: '04',
    title: 'Printing & Decoration',
    description:
      'Branding, logos and graphics are applied through the required decoration method.',
    image: lifestyleImage,
  },
  {
    number: '05',
    title: 'Stitching & Assembly',
    description:
      'Panels and components are stitched together by skilled production teams.',
    image: sportsImage,
  },
  {
    number: '06',
    title: 'Quality Control',
    description:
      'Finished products are checked for workmanship, measurements and consistency.',
    image: performanceImage,
  },
  {
    number: '07',
    title: 'Packing & Dispatch',
    description:
      'Final products are packed and prepared for safe shipment to the customer.',
    image: lifestyleImage,
  },
]

function ProcessSection() {
  return (
    <section className="process-section" id="process">
      <div className="process-inner">

        <div className="process-header">
          <p className="process-kicker">Our Process</p>

          <h2>
            <span>From Design</span>
            <span>To Your Door.</span>
          </h2>

          <p className="process-intro">
            A streamlined production journey — from concept development
            and sampling to manufacturing, inspection and final dispatch.
          </p>
        </div>

        <div className="process-scroll-wrap">
          <div className="process-scroll-content">

            <div className="process-track">
              {processSteps.map((step, index) => (
                <article
                  className={`process-card process-card-${index + 1}`}
                  key={step.number}
                >
                  <div className="process-card-image">
                    <img
                      src={step.image}
                      alt={step.title}
                    />

                    <div className="process-image-overlay" />

                    <span className="process-card-number">
                      {step.number}
                    </span>
                  </div>

                  <div className="process-card-content">
                    <h3>{step.title}</h3>

                    <span
                      className="process-card-rule"
                      aria-hidden="true"
                    />

                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="process-road-track">
              {processSteps.map((step, index) => (
                <div
                  className="process-road-item"
                  key={`road-${step.number}`}
                >
                  <div className="process-road-step">
                    <span>{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <p className="process-drag-hint">
          Swipe or scroll horizontally to explore the process
        </p>

      </div>
    </section>
  )
}

export default ProcessSection