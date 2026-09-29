import {
  useEffect,
  useState,
} from 'react'

import api from '../services/api'
import {
  preloadFirstCategoryHero,
  preloadProductCategoryImages,
} from '../services/productCategoriesCache'

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
  departments,
  setDepartments,
] = useState([])

  const [
    categories,
    setCategories,
  ] = useState([])

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true)

  const [
    categoryCardsReady,
    setCategoryCardsReady,
  ] = useState(false)

  const [
    categoriesError,
    setCategoriesError,
  ] = useState('')


  useEffect(() => {

    const controller =
      new AbortController()


    const requestOptions = {
      signal: controller.signal,
    }

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true)
        setCategoriesError('')

        const response = await api.get(
          '/categories',
          requestOptions
        )

        const loadedCategories =
          response.data.categories || []

        await preloadFirstCategoryHero(
          loadedCategories
        )

        if (controller.signal.aborted) {
          return
        }

        setCategories(
          loadedCategories
        )

        setCategoriesLoading(false)

        await preloadProductCategoryImages(
          loadedCategories
        )

        if (!controller.signal.aborted) {
          setCategoryCardsReady(true)
        }
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          console.error('Categories load error:', error)
          setCategoriesError(
            'Unable to load collections right now.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setCategoriesLoading(false)
        }
      }
    }

    const loadHomepageContent = async () => {
      try {
        const response = await api.get(
          '/home-content',
          requestOptions
        )

        setHomepageContent(response.data.content)
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          console.error('Homepage content load error:', error)
        }
      }
    }

    const loadDepartments = async () => {
      try {
        const response = await api.get(
          '/departments',
          requestOptions
        )

        setDepartments(
          response.data.departments || []
        )
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          console.error('Departments load error:', error)
        }
      }
    }

    loadCategories()
    loadHomepageContent()
    loadDepartments()


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
          categoriesLoading ||
          !categoryCardsReady
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
  departments={
    departments
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

      <Footer />
    </>
  )
}


export default Home
