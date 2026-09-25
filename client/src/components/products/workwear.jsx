import ProductCategoryPage from './shared/ProductCategoryPage'

import workwearImage from '../../assets/images/optimized/workwear.jpg'


const collections = [
  {
    title: 'Workwear',

    description:
      'Professional workwear manufactured for companies, teams and organizations requiring reliable branded apparel.',

    image: workwearImage,

    groups: [
      {
        title: 'Workwear Collection',

        items: [
          'Suits',
          'Jackets',
          'Pants',
        ],
      },
    ],
  },
]


const products = [
  {
    title: 'Suits',

    description:
      'Custom professional suits developed for corporate teams, staff uniforms and organizations requiring a coordinated appearance.',

    image: workwearImage,

    features: [
      'Custom Fit',
      'Custom Colors',
      'Brand Identity',
    ],
  },

  {
    title: 'Jackets',

    description:
      'Custom work jackets manufactured for professional use with durable construction and company branding options.',

    image: workwearImage,

    features: [
      'Durable Fabric',
      'Logo Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Pants',

    description:
      'Professional work pants designed for everyday comfort, durability and consistency across company uniform programs.',

    image: workwearImage,

    features: [
      'Custom Fit',
      'Durable Fabric',
      'Custom Sizes',
    ],
  },
]


function Workwear() {
  return (
    <ProductCategoryPage
      eyebrow="Workwear"
      title="Professional Apparel Built To Last"
      description="Custom suits, jackets and pants manufactured for companies, staff teams and professional uniform programs."
      image={workwearImage}
      collections={collections}
      galleryEyebrow="Workwear Showcase"
      galleryTitle="Explore The Collection"
      products={products}
    />
  )
}

export default Workwear
