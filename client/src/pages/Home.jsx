import {
  useEffect,
  useState,
} from 'react'

import api from '../services/api'

import Hero from '../components/home/Hero'
import AboutSection from '../components/home/AboutSection'
import ManufactureSection from '../components/home/ManufactureSection'
import Manufacture from '../components/home/ManufacturingExcellence'
import DepartmentSection from '../components/home/DepartmentsSection'
import BuyerTypesSection from '../components/home/BuyerTypesSection'
import BestSellerSection from '../components/home/BestSellersSection'
import ProcessSection from '../components/home/ProcessSection'
import FactoryFactsSection from '../components/home/FactoryFactsSection'
import StandardsSection from '../components/home/StandardsSection'
import FactoryDirectSection from '../components/home/FactoryDirectSection'
import RequestQuote from '../components/home/RequestQuote'
import Footer from '../components/home/Footer'


function Home() {

  const [
    homepageContent,
    setHomepageContent,
  ] = useState(null)


  useEffect(() => {

    const controller =
      new AbortController()


    const loadHomepageContent =
      async () => {

        try {

          const response =
            await api.get(
              '/home-content',
              {
                signal:
                  controller.signal,
              }
            )


          setHomepageContent(
            response.data.content
          )

        } catch (error) {

          if (
            error.code ===
            'ERR_CANCELED'
          ) {
            return
          }


          console.error(
            'Homepage content error:',
            error
          )

          /*
          |--------------------------------------------------------------------------
          | Existing hardcoded content stays as fallback
          |--------------------------------------------------------------------------
          */

        }

      }


    loadHomepageContent()


    return () => {
      controller.abort()
    }

  }, [])


  return (
    <>
      <Hero />

      <ManufactureSection />


      <AboutSection
        homepageContent={
          homepageContent
        }
      />


      <Manufacture
        homepageContent={
          homepageContent
        }
      />


      <DepartmentSection
        homepageContent={
          homepageContent
        }
      />


      <BuyerTypesSection />

      <BestSellerSection />

      <ProcessSection
  homepageContent={
    homepageContent
  }
/>

      <FactoryFactsSection />

      <StandardsSection />

      <FactoryDirectSection />

      <RequestQuote />

      <Footer />
    </>
  )
}


export default Home