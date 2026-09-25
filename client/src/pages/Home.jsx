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

  const [
    categories,
    setCategories,
  ] = useState([])

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true)

  const [
    categoriesError,
    setCategoriesError,
  ] = useState('')


  useEffect(() => {

    const controller =
      new AbortController()


    const loadHomeData =
      async () => {

        try {
          setCategoriesLoading(true)
          setCategoriesError('')

          const [
            homepageResponse,
            categoriesResponse,
          ] =
            await Promise.all([
              api.get(
                '/home-content',
                {
                  signal:
                    controller.signal,
                }
              ),

              api.get(
                '/categories',
                {
                  signal:
                    controller.signal,
                }
              ),
            ])


          setHomepageContent(
            homepageResponse.data.content
          )


          setCategories(
            categoriesResponse.data.categories ||
              []
          )

        } catch (error) {

          if (
            error.code ===
            'ERR_CANCELED'
          ) {
            return
          }


          console.error(
            'Home page data error:',
            error
          )


          setCategoriesError(
            'Unable to load collections right now.'
          )

          /*
          |--------------------------------------------------------------------------
          | Existing hardcoded content stays as fallback
          |--------------------------------------------------------------------------
          */

        }
        finally {
          if (
            !controller.signal.aborted
          ) {
            setCategoriesLoading(false)
          }
        }

      }


    loadHomeData()


    return () => {
      controller.abort()
    }

  }, [])


  return (
    <>
      <Hero
        categories={
          categories
        }
      />

      <ManufactureSection
        categories={
          categories
        }
        loading={
          categoriesLoading
        }
        error={
          categoriesError
        }
      />


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
