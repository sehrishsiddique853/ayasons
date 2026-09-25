import '../../style/ProcessSection.css'


import sportsImage
  from '../../assets/images/category-sports-teamwear.png'

import performanceImage
  from '../../assets/images/category-performance-wear.png'

import lifestyleImage
  from '../../assets/images/category-lifestyle-accessories.png'


const defaultProcess = {

  kicker:
    'Our Process',

  headingLine1:
    'From Design',

  headingLine2:
    'To Your Door.',

  intro:
    'A streamlined production journey — from concept development and sampling to manufacturing, inspection and final dispatch.',

  steps: [
    {
      number: '01',

      title:
        'Design & Mockup',

      description:
        'Initial concept, colors, branding and visual direction are prepared before production starts.',

      image:
        lifestyleImage,
    },

    {
      number: '02',

      title:
        'Approval & Sampling',

      description:
        'Samples are reviewed for sizing, look, material feel and overall product approval.',

      image:
        performanceImage,
    },

    {
      number: '03',

      title:
        'Pattern & Cutting',

      description:
        'Approved products move into pattern development and precise cutting preparation.',

      image:
        sportsImage,
    },

    {
      number: '04',

      title:
        'Printing & Decoration',

      description:
        'Branding, logos and graphics are applied through the required decoration method.',

      image:
        lifestyleImage,
    },

    {
      number: '05',

      title:
        'Stitching & Assembly',

      description:
        'Panels and components are stitched together by skilled production teams.',

      image:
        sportsImage,
    },

    {
      number: '06',

      title:
        'Quality Control',

      description:
        'Finished products are checked for workmanship, measurements and consistency.',

      image:
        performanceImage,
    },

    {
      number: '07',

      title:
        'Packing & Dispatch',

      description:
        'Final products are packed and prepared for safe shipment to the customer.',

      image:
        lifestyleImage,
    },
  ],
}


function ProcessSection({
  homepageContent,
}) {

  const managedProcess =
    homepageContent
      ?.process


  const process = {

    kicker:
      managedProcess
        ?.kicker ||
      defaultProcess
        .kicker,


    headingLine1:
      managedProcess
        ?.headingLine1 ||
      defaultProcess
        .headingLine1,


    headingLine2:
      managedProcess
        ?.headingLine2 ||
      defaultProcess
        .headingLine2,


    intro:
      managedProcess
        ?.intro ||
      defaultProcess
        .intro,
  }


  const managedSteps =
    Array.isArray(
      managedProcess
        ?.steps
    )
      ? managedProcess.steps
      : []


  const processSteps =
    defaultProcess
      .steps
      .map(
        (
          fallbackStep,
          index
        ) => {

          const managedStep =
            managedSteps[index]


          if (!managedStep) {
            return fallbackStep
          }


          return {

            id:
              managedStep.id,


            number:
              managedStep
                .number ||
              fallbackStep
                .number,


            title:
              managedStep
                .title ||
              fallbackStep
                .title,


            description:
              managedStep
                .description ||
              fallbackStep
                .description,


            image:
              managedStep
                .image
                ?.available &&
              managedStep
                .image
                ?.url

                ? managedStep
                    .image
                    .url

                : fallbackStep
                    .image,
          }

        }
      )


  return (
    <section
      className="process-section"
      id="process"
    >

      <div className="process-inner">

        <div className="process-header">

          <p className="process-kicker">
            {process.kicker}
          </p>


          <h2>

            <span>
              {
                process
                  .headingLine1
              }
            </span>

            <span>
              {
                process
                  .headingLine2
              }
            </span>

          </h2>


          <p className="process-intro">
            {process.intro}
          </p>

        </div>


        <div className="process-scroll-wrap">

          <div className="process-scroll-content">

            <div className="process-track">

              {processSteps.map(
                (
                  step,
                  index
                ) => (

                  <article
                    className={
                      `process-card process-card-${index + 1}`
                    }
                    key={
                      step.id ||
                      step.number
                    }
                  >

                    <div className="process-card-image">

                      <img
                        src={
                          step.image
                        }
                        alt={
                          step.title
                        }
                      />


                      <div className="process-image-overlay" />


                      <span className="process-card-number">
                        {
                          step.number
                        }
                      </span>

                    </div>


                    <div className="process-card-content">

                      <h3>
                        {
                          step.title
                        }
                      </h3>


                      <span
                        className="process-card-rule"
                        aria-hidden="true"
                      />


                      <p>
                        {
                          step.description
                        }
                      </p>

                    </div>

                  </article>

                )
              )}

            </div>


            <div className="process-road-track">

              {processSteps.map(
                (
                  step,
                  index
                ) => (

                  <div
                    className="process-road-item"
                    key={
                      `road-${
                        step.id ||
                        step.number
                      }`
                    }
                  >

                    <div className="process-road-step">

                      <span>
                        {
                          index + 1
                        }
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>


        <p className="process-drag-hint">
          Swipe or scroll horizontally
          to explore the process
        </p>

      </div>

    </section>
  )
}


export default ProcessSection