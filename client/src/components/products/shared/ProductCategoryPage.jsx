import {
  useEffect,
  useState,
} from 'react'

import {
  useParams,
} from 'react-router-dom'

import Footer from '../../home/Footer'

import CategoryHero from './CategoryHero'
import ProductCollectionSection from './ProductCollectionSection'
import ProductGallery from './ProductGallery'
import PageLoader from '../../common/PageLoader'

import api from '../../../services/api'
import { withImageWidth } from '../../../utils/imageUrl'

import '../../../style/products/Activewear.css'


function ProductCategoryPage() {
  const {
    categorySlug,
  } = useParams()


  const [
    category,
    setCategory,
  ] = useState(null)


  const [
    products,
    setProducts,
  ] = useState([])


  const [
    loading,
    setLoading,
  ] = useState(true)


  const [
    error,
    setError,
  ] = useState('')


  useEffect(() => {
    const controller =
      new AbortController()


    const loadCategory = async () => {
      try {
        setLoading(true)
        setError('')


        /*
        |--------------------------------------------------------------------------
        | Fetch Category + Products
        |--------------------------------------------------------------------------
        */

        const [
          categoryResponse,
          productsResponse,
        ] =
          await Promise.all([
            api.get(
              `/categories/${categorySlug}`,
              {
                signal:
                  controller.signal,
              }
            ),

            api.get(
              `/products/category/${categorySlug}`,
              {
                signal:
                  controller.signal,
              }
            ),
          ])


        setCategory(
          categoryResponse.data.category
        )


        setProducts(
          productsResponse.data.products ||
            []
        )

      } catch (requestError) {

        /*
        |--------------------------------------------------------------------------
        | Ignore Request Cancellation
        |--------------------------------------------------------------------------
        */

        if (
          requestError.code ===
          'ERR_CANCELED'
        ) {
          return
        }


        console.error(
          'Failed to load product category:',
          requestError
        )


        if (
          requestError.response
            ?.status === 404
        ) {
          setError(
            'Category not found.'
          )
        } else {
          setError(
            'Unable to load this category right now.'
          )
        }

      } finally {

        if (
          !controller.signal.aborted
        ) {
          setLoading(false)
        }
      }
    }


    loadCategory()


    return () => {
      controller.abort()
    }

  }, [categorySlug])


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <>
        <main className="activewear-page">
          <div className="activewear-content">
            <PageLoader
              label="Loading collection"
              variant="inline"
            />
          </div>
        </main>

        <Footer />
      </>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Error / Missing Category
  |--------------------------------------------------------------------------
  */

  if (
    error ||
    !category
  ) {
    return (
      <>
        <main className="activewear-page">
          <div className="activewear-content">

            <h1>
              Collection unavailable
            </h1>

            <p>
              {error ||
                'Category not found.'}
            </p>

          </div>
        </main>

        <Footer />
      </>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Images
  |--------------------------------------------------------------------------
  */

  const heroImage =
    withImageWidth(
      category.heroImage?.url ||
      category.collectionImage
        ?.url ||
      '',
      1400
    )


  const collectionImage =
    withImageWidth(
      category.collectionImage
        ?.url ||
      category.heroImage?.url ||
      '',
      900
    )


  const cardImage =
    withImageWidth(
      category.collectionImage
        ?.url ||
      category.heroImage?.url ||
      '',
      520
    )


  /*
  |--------------------------------------------------------------------------
  | Convert API Products To Existing ProductCard Shape
  |--------------------------------------------------------------------------
  |
  | API:
  |
  | name
  | image.url
  |
  | Existing ProductCard expects:
  |
  | title
  | image
  |
  */

  const galleryProducts =
    products.map(
      (product) => ({
        title:
          product.name,

        description:
          product.description,

        image:
          cardImage ||
          product.image?.url,

        features:
          product.features || [],
      })
    )


  return (
    <>
      <main className="activewear-page">

        <CategoryHero
          eyebrow={
            category.eyebrow ||
            category.name
          }

          title={
            category.heroTitle ||
            category.name
          }

          description={
            category.description
          }

          image={heroImage}
        />


        <div className="activewear-content">

          <ProductCollectionSection
            title={
              category.name
            }

            description={
              category.collectionDescription ||
              category.description
            }

            image={
              collectionImage
            }

            groups={
              category.groups || []
            }
          />

        </div>


        <ProductGallery
          eyebrow={
            `${category.name} Showcase`
          }

          title="Explore The Collection"

          products={
            galleryProducts
          }
        />

      </main>


      <Footer />
    </>
  )
}


export default ProductCategoryPage
