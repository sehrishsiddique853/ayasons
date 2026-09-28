import {
  useEffect,
  useState,
} from 'react'

import api from '../../services/api'

import addImagePlaceholder
  from '../../assets/images/optimized/add-image-placeholder.jpg'

import '../../style/StandardsSection.css'


const fallbackContent = {
  kicker:
    'Certifications & Compliance',

  heading:
    'Documentation Available On Request',

  footerText:
    `Verify before you order - we encourage it. Ask for certificate copies with your enquiry, book a live video tour on WhatsApp, and order a sample before bulk. Details on the certifications, quality control and about the factory pages.`,
}


const fallbackStandards = [
  {
    id: 'fallback-1',

    title:
      'ISO 9001:2015',

    description:
      'Quality management system',

    logo: {
      available: false,
      url: null,
    },

    certificate: {
      available: false,
      url: null,
    },
  },

  {
    id: 'fallback-2',

    title:
      'OEKO-TEX® Standard 100',

    description:
      'Fabrics tested for harmful substances',

    logo: {
      available: false,
      url: null,
    },

    certificate: {
      available: false,
      url: null,
    },
  },

  {
    id: 'fallback-3',

    title:
      'BSCI Audited',

    description:
      'Social compliance audit',

    logo: {
      available: false,
      url: null,
    },

    certificate: {
      available: false,
      url: null,
    },
  },

  {
    id: 'fallback-4',

    title:
      'GRS Options',

    description:
      'Recycled polyester on request',

    logo: {
      available: false,
      url: null,
    },

    certificate: {
      available: false,
      url: null,
    },
  },

  {
    id: 'fallback-5',

    title:
      'SGS Testing',

    description:
      'Third-party lab testing on request',

    logo: {
      available: false,
      url: null,
    },

    certificate: {
      available: false,
      url: null,
    },
  },

  {
    id: 'fallback-6',

    title:
      'Export Licensed',

    description:
      'Export-ready manufacturing support',

    logo: {
      available: false,
      url: null,
    },

    certificate: {
      available: false,
      url: null,
    },
  },
]


function StandardsSection() {

  const [
    content,
    setContent,
  ] = useState(
    fallbackContent
  )


  const [
    standards,
    setStandards,
  ] = useState(
    fallbackStandards
  )


  useEffect(
    () => {

      let mounted = true


      const loadStandards =
        async () => {

          try {

            const response =
              await api.get(
                '/standards'
              )


            if (!mounted) {
              return
            }


            const data =
              response.data


            if (data?.content) {

              setContent({
                kicker:
                  data.content
                    .kicker ||
                  fallbackContent
                    .kicker,

                heading:
                  data.content
                    .heading ||
                  fallbackContent
                    .heading,

                footerText:
                  data.content
                    .footerText ||
                  fallbackContent
                    .footerText,
              })

            }


            if (
              Array.isArray(
                data?.standards
              )
            ) {

              setStandards(
                data.standards
              )

            }

          } catch (error) {

            console.error(
              'Failed to load certifications:',
              error
            )

          }

        }


      loadStandards()


      return () => {
        mounted = false
      }

    },
    []
  )


  const renderLogo = (
    standard
  ) => {

    const logoUrl =
      standard.logo
        ?.available &&
      standard.logo
        ?.url
        ? standard.logo.url
        : addImagePlaceholder


    const logoContent = (

      <div className="standard-logo-box">

        <img
          src={logoUrl}
          alt={
            standard.logo
              ?.available
              ? `${standard.title} logo`
              : 'Add certification logo'
          }
          loading="lazy"
          decoding="async"
        />

      </div>

    )


    if (
      standard.certificate
        ?.available &&
      standard.certificate
        ?.url
    ) {

      return (

        <a
          href={
            standard
              .certificate
              .url
          }
          target="_blank"
          rel="noreferrer"
          className="standard-logo-link"
          aria-label={
            `View ${standard.title} certificate`
          }
        >

          {logoContent}

        </a>

      )

    }


    return logoContent

  }


  return (

    <section
      className="standards-section"
      id="standards"
    >

      <div className="standards-inner">

        <div className="standards-header">

          <p className="standards-kicker">
            {content.kicker}
          </p>


          <h2>
            {content.heading}
          </h2>

        </div>


        <div className="standards-grid">

          {standards.map(
            (
              standard,
              index
            ) => (

              <article
                className="standard-card"
                key={
                  standard.id ||
                  `${standard.title}-${index}`
                }
              >

                <div className="standard-card-main">

                  <div className="standard-content">

                    <span className="standard-index">
                      {
                        String(
                          index + 1
                        ).padStart(
                          2,
                          '0'
                        )
                      }
                    </span>


                    <h3>
                      {standard.title}
                    </h3>


                    <span
                      className="standard-rule"
                      aria-hidden="true"
                    />


                    <p>
                      {
                        standard
                          .description
                      }
                    </p>

                  </div>


                  <div className="standard-logo-area">

                    {
                      renderLogo(
                        standard
                      )
                    }

                  </div>

                </div>


                <div className="standard-card-footer">

                  {
                    standard
                      .certificate
                      ?.available &&
                    standard
                      .certificate
                      ?.url
                      ? (

                        <a
                          href={
                            standard
                              .certificate
                              .url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="standard-certificate-link"
                        >

                          View Certificate

                          <span
                            aria-hidden="true"
                          >
                            ↗
                          </span>

                        </a>

                      )
                      : (

                        <span className="standard-certificate-unavailable">
                         
                        </span>

                      )
                  }

                </div>

              </article>

            )
          )}

        </div>


        {
          content.footerText && (

            <div className="standards-footer">

              <p>
                {
                  content.footerText
                }
              </p>

            </div>

          )
        }

      </div>

    </section>

  )
}


export default StandardsSection