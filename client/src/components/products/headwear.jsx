import ProductCategoryPage from './shared/ProductCategoryPage'

import headwearImage from '../../assets/images/headwear.png'


const collections = [
  {
    title: 'Headwear',

    description:
      'Custom caps, hats and beanies manufactured for brands, teams, merchandise programs and retail collections.',

    image: headwearImage,

    groups: [
      {
        title: 'Headwear Collection',

        items: [
          'Beanies',
          'Bucket Hat',
          'Trucker Hat',
          'Baseball Cap',
          'Visor Cap',
          'Jeep Cap',
          'Snapback Cap',
        ],
      },
    ],
  },
]


const products = [
  {
    title: 'Beanies',

    description:
      'Custom beanies developed for cold-weather collections, teams, streetwear brands and branded merchandise.',

    image: headwearImage,

    features: [
      'Custom Colors',
      'Logo Branding',
      'Custom Knit',
    ],
  },

  {
    title: 'Bucket Hat',

    description:
      'Custom bucket hats designed for lifestyle collections, streetwear brands, teams and promotional merchandise.',

    image: headwearImage,

    features: [
      'Custom Colors',
      'Embroidery',
      'Custom Branding',
    ],
  },

  {
    title: 'Trucker Hat',

    description:
      'Custom trucker hats combining structured front panels with breathable mesh for casual and promotional collections.',

    image: headwearImage,

    features: [
      'Custom Colors',
      'Logo Branding',
      'Mesh Options',
    ],
  },

  {
    title: 'Baseball Cap',

    description:
      'Classic custom baseball caps manufactured for sports teams, brands, staff uniforms and retail merchandise.',

    image: headwearImage,

    features: [
      'Custom Embroidery',
      'Adjustable Fit',
      'Custom Colors',
    ],
  },

  {
    title: 'Visor Cap',

    description:
      'Custom visor caps designed for outdoor sports, training, golf, tennis and lightweight teamwear collections.',

    image: headwearImage,

    features: [
      'Custom Colors',
      'Logo Branding',
      'Adjustable Fit',
    ],
  },

  {
    title: 'Jeep Cap',

    description:
      'Custom jeep caps developed for warm, casual and outdoor collections with branded detailing and flexible styling.',

    image: headwearImage,

    features: [
      'Custom Knit',
      'Brand Labels',
      'Custom Colors',
    ],
  },

  {
    title: 'Snapback Cap',

    description:
      'Structured custom snapback caps designed for streetwear, sports teams, merchandise and private-label collections.',

    image: headwearImage,

    features: [
      'Custom Embroidery',
      'Snap Closure',
      'Custom Colors',
    ],
  },
]


function Headwear() {
  return (
    <ProductCategoryPage
      eyebrow="Headwear"

      title="Custom Headwear For Every Collection"

      description="Custom beanies, caps and hats manufactured for sports teams, streetwear labels and branded merchandise programs."

      image={headwearImage}

      collections={collections}

      galleryEyebrow="Headwear Showcase"

      galleryTitle="Explore The Collection"

      products={products}
    />
  )
}

export default Headwear