import ProductCategoryPage from './shared/ProductCategoryPage'

import streetwearImage from '../../assets/images/optimized/category-lifestyle-accessories.jpg'


const collections = [
  {
    title: 'Streetwear',

    description:
      'Custom streetwear and lifestyle apparel manufactured for brands, private-label collections and everyday wear.',

    image: streetwearImage,

    groups: [
      {
        title: 'Streetwear Collection',

        items: [
          'Hoodies',
          'Trousers',
          'T-Shirts',
          'Tracksuits',
          'Sweatsuits',
          'Sweat Pant',
          'Sweat Shirt',
          'Shorts',
          '3 Quarter Shorts',
          'Windbreaker Sets',
          'Denim Jeans Pants',
          'Denim Shorts',
          'Tank Tops',
        ],
      },
    ],
  },
]


const products = [
  {
    title: 'Hoodies',
    description:
      'Custom hoodies designed for streetwear labels, lifestyle collections and private-label brands with flexible fabric and branding options.',
    image: streetwearImage,
    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Trousers',
    description:
      'Custom streetwear trousers developed for comfortable everyday wear with brand-specific styling and finishing.',
    image: streetwearImage,
    features: [
      'Custom Fit',
      'Custom Branding',
      'Custom Colors',
    ],
  },

  {
    title: 'T-Shirts',
    description:
      'Custom T-shirts manufactured for lifestyle brands, merchandise collections and private-label streetwear programs.',
    image: streetwearImage,
    features: [
      'Custom Prints',
      'Custom Labels',
      'Custom Sizes',
    ],
  },

  {
    title: 'Tracksuits',
    description:
      'Matching custom tracksuits created for lifestyle collections, teams and brands that want coordinated tops and bottoms.',
    image: streetwearImage,
    features: [
      'Matching Sets',
      'Custom Branding',
      'Custom Colors',
    ],
  },

  {
    title: 'Sweatsuits',
    description:
      'Comfort-focused sweatsuits developed for casual collections with coordinated styling and custom brand details.',
    image: streetwearImage,
    features: [
      'Custom Fabric',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Sweat Pant',
    description:
      'Custom sweat pants designed for relaxed everyday wear, training and lifestyle-focused apparel collections.',
    image: streetwearImage,
    features: [
      'Custom Fit',
      'Logo Branding',
      'Custom Colors',
    ],
  },

  {
    title: 'Sweat Shirt',
    description:
      'Custom sweatshirts manufactured for casual and streetwear collections with flexible decoration and finishing options.',
    image: streetwearImage,
    features: [
      'Custom Prints',
      'Embroidery',
      'Custom Colors',
    ],
  },

  {
    title: 'Shorts',
    description:
      'Custom casual shorts designed for streetwear, warm-weather collections and comfortable everyday use.',
    image: streetwearImage,
    features: [
      'Custom Fit',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: '3 Quarter Shorts',
    description:
      'Three-quarter shorts manufactured for relaxed lifestyle collections with customizable fits, colors and brand details.',
    image: streetwearImage,
    features: [
      'Custom Fit',
      'Custom Colors',
      'Logo Branding',
    ],
  },

  {
    title: 'Windbreaker Sets',
    description:
      'Lightweight windbreaker sets developed for outerwear, travel and coordinated streetwear collections.',
    image: streetwearImage,
    features: [
      'Lightweight Fabric',
      'Custom Branding',
      'Custom Colors',
    ],
  },

  {
    title: 'Denim Jeans Pants',
    description:
      'Custom denim jeans manufactured for lifestyle and streetwear collections with brand-led fits, washes and detailing.',
    image: streetwearImage,
    features: [
      'Custom Fit',
      'Custom Details',
      'Private Labels',
    ],
  },

  {
    title: 'Denim Shorts',
    description:
      'Custom denim shorts created for casual and seasonal collections with flexible washes, trims and branding.',
    image: streetwearImage,
    features: [
      'Custom Wash',
      'Custom Branding',
      'Custom Fit',
    ],
  },

  {
    title: 'Tank Tops',
    description:
      'Custom tank tops developed for casual, summer and lifestyle collections with brand-specific colors and finishing.',
    image: streetwearImage,
    features: [
      'Custom Colors',
      'Custom Prints',
      'Custom Sizes',
    ],
  },
]


function Streetwear() {
  return (
    <ProductCategoryPage
      eyebrow="Streetwear"
      title="Lifestyle Apparel With A Custom Edge"
      description="Custom hoodies, tracksuits, denim, T-shirts and lifestyle apparel manufactured for private-label brands and retail collections."
      image={streetwearImage}
      collections={collections}
      galleryEyebrow="Streetwear Showcase"
      galleryTitle="Explore The Collection"
      products={products}
    />
  )
}

export default Streetwear
