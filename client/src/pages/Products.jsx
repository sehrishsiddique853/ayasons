import {
  useEffect,
  useState,
} from 'react'

import {
  getCachedProductCategories,
  loadProductCategories,
} from '../services/productCategoriesCache'

import ManufactureSection
  from '../components/home/ManufactureSection'

import Footer
  from '../components/home/Footer'


function Products() {

  const cachedCategories =
    getCachedProductCategories()

  const [
    categories,
    setCategories,
  ] = useState(cachedCategories || [])


  const [
    loading,
    setLoading,
  ] = useState(!cachedCategories)


  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {

    const controller =
      new AbortController()


    const loadCategories =
      async () => {

        try {

          if (!getCachedProductCategories()) {
            setLoading(true)
          }
          setError('')


          const loadedCategories =
            await loadProductCategories()

          if (controller.signal.aborted) {
            return
          }


          setCategories(
            loadedCategories
          )

        } catch (error) {

          if (
            error.code ===
            'ERR_CANCELED'
          ) {
            return
          }


          console.error(
            'Products page error:',
            error
          )


          setError(
            'Unable to load collections right now.'
          )

        } finally {

          if (
            !controller
              .signal
              .aborted
          ) {

            setLoading(false)

          }

        }

      }


    loadCategories()


    return () => {
      controller.abort()
    }

  }, [])


  return (
    <>

      <ManufactureSection
        categories={
          categories
        }
        loading={
          loading
        }
        error={
          error
        }
      />


      <Footer />

    </>
  )

}


export default Products
