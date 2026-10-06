import {
  useEffect,
  useState,
} from 'react'

import api from '../services/api'
import {
  getLastProductCategories,
  loadProductCategories,
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
  ] = useState(() => getLastProductCategories() || [])

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(() => !getLastProductCategories())

  const [
    categoriesError,
    setCategoriesError,
  ] = useState('')


  useEffect(() => {

    const controller =
      new AbortController()


    const loadCategories = async () => {
      try {
        if (!getLastProductCategories()) {
          setCategoriesLoading(true)
        }
        setCategoriesError('')
        const loadedCategories = await loadProductCategories()

        if (controller.signal.aborted) {
          return
        }

        setCategories(
          loadedCategories
        )

        setCategoriesLoading(false)
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

    const requestOptions = {
      signal: controller.signal,
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
