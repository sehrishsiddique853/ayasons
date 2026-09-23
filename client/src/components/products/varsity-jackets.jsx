import ProductCategoryPage from './shared/ProductCategoryPage'

import varsityImage from '../../assets/images/versity_jackets.png'


const collections = [
  {
    title: 'Varsity Jackets',

    description:
      'Custom varsity and outerwear jackets manufactured for schools, clubs, brands and private-label collections.',

    image: varsityImage,

    groups: [
      {
        title: 'Jacket Collection',

        items: [
          'Wool-Leather',
          'Satin',
          'Cotton Fleece',
          'Bomper Jacket',
          'Puffer Jacket',
          'Softshell Jacket',
        ],
      },
    ],
  },
]


const products = [
  {
    title: 'Wool-Leather',
    description:
      'Classic varsity jackets combining wool bodies with leather sections for a premium school, club or brand-focused finish.',
    image: varsityImage,
    features: [
      'Custom Colors',
      'Custom Patches',
      'Custom Sizes',
    ],
  },

  {
    title: 'Satin',
    description:
      'Lightweight satin jackets designed for fashion, team and lifestyle collections with a smooth branded finish.',
    image: varsityImage,
    features: [
      'Custom Colors',
      'Embroidery',
      'Custom Branding',
    ],
  },

  {
    title: 'Cotton Fleece',
    description:
      'Comfortable cotton fleece jackets developed for casual outerwear collections, clubs and branded apparel programs.',
    image: varsityImage,
    features: [
      'Soft Fabric',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Bomper Jacket',
    description:
      'Custom bomber-style jackets manufactured for streetwear, team and lifestyle collections with flexible trim and branding options.',
    image: varsityImage,
    features: [
      'Custom Ribbing',
      'Custom Branding',
      'Custom Colors',
    ],
  },

  {
    title: 'Puffer Jacket',
    description:
      'Insulated custom puffer jackets designed for colder conditions, outdoor use and branded winter collections.',
    image: varsityImage,
    features: [
      'Insulated Build',
      'Custom Branding',
      'Custom Colors',
    ],
  },

  {
    title: 'Softshell Jacket',
    description:
      'Versatile softshell jackets developed for teams, businesses and outdoor collections requiring lightweight protection and comfort.',
    image: varsityImage,
    features: [
      'Lightweight',
      'Custom Logos',
      'Custom Sizes',
    ],
  },
]


function VarsityJackets() {
  return (
    <ProductCategoryPage
      eyebrow="Varsity Jackets"
      title="Custom Jackets With Statement Detail"
      description="Custom wool-leather, satin, fleece, bomber, puffer and softshell jackets manufactured for brands, schools and teams."
      image={varsityImage}
      collections={collections}
      galleryEyebrow="Jacket Showcase"
      galleryTitle="Explore The Collection"
      products={products}
    />
  )
}

export default VarsityJackets