import '../../style/DepartmentsSection.css'
import addImagePlaceholder
  from '../../assets/images/add-image-placeholder.png'

const defaultStats = [
  {
    value: '150+',
    label: 'Skilled Professionals',
  },

  {
    value: '40K–50K+',
    label: 'Pieces Monthly Capacity',
  },

  {
    value: '06',
    label: 'Production Departments',
  },

  {
    value: '20+',
    label: 'Years Experience',
  },
]


const departments = [
  {
    number: '01',

    title:
      'Pattern & Cutting',

    description:
      'From pattern development and size grading to precise cutting, every garment begins with accuracy and careful preparation.',

    image:
      addImagePlaceholder,
  },

  {
    number: '02',

    title:
      'Sublimation Printing',

    description:
      'Performance apparel is produced with high-quality sublimation processes for vibrant colors, graphics and lasting finishes.',

    image:
      addImagePlaceholder,
  },

  {
    number: '03',

    title:
      'Embroidery & Decoration',

    description:
      'Custom logos, names and branding are applied using embroidery and decoration techniques according to product requirements.',

    image:
      addImagePlaceholder,
  },

  {
    number: '04',

    title:
      'Stitching Floor',

    description:
      'Experienced production teams handle garment assembly with attention to construction, strength and finishing standards.',

    image:
      addImagePlaceholder,
  },

  {
    number: '05',

    title:
      'Bag Manufacturing',

    description:
      'Custom kit bags, duffle bags and other accessories are developed with durable materials and reinforced construction.',

    image:
      addImagePlaceholder,
  },

  {
    number: '06',

    title:
      'Quality Control & Packing',

    description:
      'Finished products are inspected for workmanship, measurements and overall quality before final packing and dispatch.',

    image:
      addImagePlaceholder,
  },
]


function DepartmentsSection({
  homepageContent,
}) {

  const stats =
    Array.isArray(
      homepageContent
        ?.departmentStats
    ) &&
    homepageContent
      .departmentStats
      .length === 4
      ? homepageContent
          .departmentStats
      : defaultStats


  return (
    <section className="departments-section">

      <div className="departments-inner">

        <div className="departments-top">

          <div className="departments-heading">

            <p className="departments-kicker">
              Departments & Capabilities
            </p>


            <h2>

              <span>
                Every Stage.
              </span>

              <span>
                One Production
              </span>

              <span>
                Standard.
              </span>

            </h2>


            <p className="departments-intro">

              Our production process
              brings key manufacturing
              stages together to
              maintain consistency from
              product development
              through finishing and
              final packing.

            </p>

          </div>


          <div className="departments-stats">

            {stats.map(
              (
                stat,
                index
              ) => (

                <div
                  className="department-stat"
                  key={
                    `${stat.label}-${index}`
                  }
                >

                  <strong>
                    {stat.value}
                  </strong>

                  <span>
                    {stat.label}
                  </span>

                </div>

              )
            )}

          </div>

        </div>


        <div className="departments-grid">

          {departments.map(
            (
              department
            ) => (

             <article
  className="department-card"
  key={
    department.number
  }
>

  <div className="department-card-image">

    <img
      src={
        department.image
      }
      alt={
        department.title
      }
    />

    <div className="department-card-image-overlay" />

    <span className="department-number">
      {
        department.number
      }
    </span>

  </div>


  <div className="department-card-content">

    <h3>
      {
        department.title
      }
    </h3>


    <span
      className="department-card-rule"
      aria-hidden="true"
    />


    <p>
      {
        department.description
      }
    </p>

  </div>

</article>

            )
          )}

        </div>


        <div className="departments-footer">

          <p>

            From initial development to
            final quality inspection,
            every stage is focused on
            producing reliable custom
            apparel for brands, teams
            and businesses.

          </p>


          <a
            href="#manufacturing"
            className="departments-button"
          >

            View Full Capabilities

            <span aria-hidden="true">
              →
            </span>

          </a>

        </div>

      </div>

    </section>
  )
}


export default DepartmentsSection