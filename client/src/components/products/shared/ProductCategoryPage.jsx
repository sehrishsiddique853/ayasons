import Footer from '../../home/Footer'

import CategoryHero from './CategoryHero'
import ProductCollectionSection from './ProductCollectionSection'
import ProductGallery from './ProductGallery'

import '../../../style/products/Activewear.css'

function ProductCategoryPage({
  eyebrow,
  title,
  description,
  image,
  collections,
  galleryEyebrow,
  galleryTitle,
  products,
}) {
  return (
    <>
      <main className="activewear-page">

        <CategoryHero
          eyebrow={eyebrow}
          title={title}
          description={description}
          image={image}
        />

        <div className="activewear-content">
          {collections.map((collection, index) => (
            <ProductCollectionSection
              key={collection.title}
              reverse={index % 2 === 1}
              {...collection}
            />
          ))}
        </div>

        <ProductGallery
          eyebrow={galleryEyebrow}
          title={galleryTitle}
          products={products}
        />

      </main>

      <Footer />
    </>
  )
}

export default ProductCategoryPage
