import {
  useEffect,
  useState,
} from 'react'

import {
  getCachedHomepageContent,
  loadHomepageContent,
} from '../services/homepageContentCache'

import AboutSection
  from '../components/home/AboutSection'
import AboutIntroSection
  from '../components/about/AboutIntroSection'

import Footer
  from '../components/home/Footer'

function About() {

  const [
    homepageContent,
    setHomepageContent,
  ] = useState(
    getCachedHomepageContent()
  )


  useEffect(() => {

    const controller =
      new AbortController()


    const loadAboutPage =
      async () => {

        try {

          const content =
            await loadHomepageContent()


          if (
            controller.signal.aborted
          ) {
            return
          }


          setHomepageContent(
            content
          )

        } catch (error) {

          if (
            error.code ===
            'ERR_CANCELED'
          ) {
            return
          }


          console.error(
            'About page error:',
            error
          )

          /*
          |--------------------------------------------------------------------------
          | AboutSection will use its local fallback image
          |--------------------------------------------------------------------------
          */

        }

      }


    loadAboutPage()


    return () => {
      controller.abort()
    }

  }, [])


  return (
    <>

      <AboutIntroSection />

      <AboutSection
        homepageContent={
          homepageContent
        }
        priority
      />


      <Footer />

    </>
  )

}


export default About
