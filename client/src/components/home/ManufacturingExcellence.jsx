import {
  useEffect,
  useRef,
} from 'react'

import factoryImage
  from '../../assets/images/optimized/ayosons-about-manufacturing.jpg'


const defaultManufacturingStats = [
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


function ManufacturingExcellence({
  homepageContent,
  priority = false,
}) {
  const videoRef = useRef(null)


  const manufacturingStats =
    Array.isArray(
      homepageContent
        ?.manufacturingStats
    ) &&
    homepageContent
      .manufacturingStats
      .length === 3
      ? homepageContent
          .manufacturingStats
      : defaultManufacturingStats


  const manufacturingVideo =
    homepageContent
      ?.manufacturingVideo


  const hasVideo =
    Boolean(
      manufacturingVideo
        ?.available &&
      manufacturingVideo
        ?.url
    )


  useEffect(() => {
    const video = videoRef.current

    if (!video || !hasVideo) {
      return undefined
    }

    const startPlayback = () => {
      video.preload = 'auto'
      video.play().catch(() => {})
    }

    if (priority || !('IntersectionObserver' in window)) {
      startPlayback()
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPlayback()
        } else {
          video.pause()
        }
      },
      {
        rootMargin: '900px 0px',
        threshold: 0,
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [hasVideo, priority, manufacturingVideo?.url])


  return (
    <section
      className="manufacturing-excellence"
      id="manufacturing"
    >

      <div className="manufacturing-excellence-inner">

        <div className="manufacturing-excellence-content">

          <p className="manufacturing-kicker">
            Our Manufacturing
          </p>


          <h2>

            <span>
              Manufacturing
            </span>

            <span>
              Excellence
            </span>

            <span>
              Built For Brands.
            </span>

          </h2>


          <p className="manufacturing-intro">

            From initial product
            development to final
            packaging, our manufacturing
            process is built to deliver
            custom apparel with
            consistency, attention to
            detail and dependable
            production standards.

          </p>


          <p className="manufacturing-copy">

            Design, fabric selection,
            cutting, stitching,
            printing, embroidery,
            finishing and quality
            inspection are managed
            through a streamlined
            production process —
            helping brands turn their
            ideas into finished
            products.

          </p>


          <div className="manufacturing-capabilities">

            {capabilities.map(
              (capability) => (

                <span
                  key={
                    capability
                  }
                >
                  {
                    capability
                  }
                </span>

              )
            )}

          </div>


          <div className="manufacturing-stats">

            {manufacturingStats.map(
              (
                stat,
                index
              ) => (

                <div
                  className="manufacturing-stat"
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


        <div className="manufacturing-visual">

          {hasVideo ? (

            <video
  ref={videoRef}
  className="manufacturing-video"
  src={
    manufacturingVideo
      .url
  }
  
  autoPlay={priority}
  loop
  muted
  playsInline
  controls
  preload={priority ? 'auto' : 'metadata'}
>
              Your browser does not
              support HTML5 video.
            </video>

          ) : (

            <img
              src={
                factoryImage
              }
              alt="AYOSONS apparel manufacturing facility"
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              fetchPriority={priority ? 'high' : 'low'}
            />

          )}


          <div className="manufacturing-image-overlay" />


          <div className="manufacturing-media-label">

            <span>
              Inside AYOSONS
            </span>

            <strong>
              Our Production
            </strong>

          </div>


          <div className="manufacturing-image-number">
            01
          </div>

        </div>

      </div>

    </section>
  )
}


export default ManufacturingExcellence
