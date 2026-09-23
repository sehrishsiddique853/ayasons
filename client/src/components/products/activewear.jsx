
import Footer from '../home/Footer'

import CategoryHero from './shared/CategoryHero'
import ProductCollectionSection from './shared/ProductCollectionSection'
import ProductGallery from './shared/ProductGallery'

import performanceImage from '../../assets/images/category-performance-wear.png'

import '../../style/products/Activewear.css'


const activewearGroups = [
  {
    title: 'Men',
    items: [
      "Men's Tops / T-Shirts",
      "Men's Bottoms / Trousers",
      "Men's Tank Tops",
      "Men's Shorts",
      "Men's Compression Tops / Bottoms / Shorts",
    ],
  },

  {
    title: 'Women',
    items: [
      "Women's Tops / T-Shirts",
      "Women's Bottoms / Trousers",
      "Women's Tank Tops",
      "Women's Sports Bra",
      "Women's Shorts",
      'Leggings',
    ],
  },
]


const activewearProducts = [
  {
    title: "Men's Tops / T-Shirts",

    description:
      'Performance-focused tops designed for training, fitness and everyday active use.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: "Men's Bottoms / Trousers",

    description:
      'Comfortable performance bottoms developed for movement, training and active lifestyles.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: "Men's Tank Tops",

    description:
      'Lightweight training tank tops designed for fitness, gym and performance collections.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: "Men's Shorts",

    description:
      'Custom performance shorts built for training, movement and everyday athletic use.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Compression Wear',

    description:
      'Performance compression tops, bottoms and shorts developed for active and training use.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: "Women's Tops / T-Shirts",

    description:
      'Custom performance tops designed around comfort, flexibility and active movement.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: "Women's Bottoms / Trousers",

    description:
      'Performance bottoms developed for gym, fitness, training and activewear collections.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: "Women's Tank Tops",

    description:
      'Lightweight activewear tank tops designed for movement, comfort and training.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: "Women's Sports Bras",

    description:
      'Performance sports bras created for fitness, studio training and activewear brands.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: "Women's Shorts",

    description:
      'Custom women\'s training shorts developed for active performance and everyday fitness.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Leggings',

    description:
      'Performance leggings designed for gym, training, fitness and active lifestyle collections.',

    image: performanceImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },
]


function Activewear() {
  return (
    <>
      <main className="activewear-page">

        <CategoryHero
          eyebrow="Activewear"
          title="Performance Made For Movement"
          description="Custom gym, fitness and activewear manufactured for brands, studios and performance-focused collections."
          image={performanceImage}
        />

       <div className="activewear-content">

  <ProductCollectionSection
    title="Activewear"
    description="Custom gym, fitness and performance apparel developed for men and women, with flexible branding, sizing and manufacturing options."
    image={performanceImage}
    groups={activewearGroups}
  />

</div>

        <ProductGallery
          eyebrow="Activewear Showcase"
          title="Explore The Collection"
          products={activewearProducts}
        />

      </main>

      <Footer />
    </>
  )
}

export default Activewear


