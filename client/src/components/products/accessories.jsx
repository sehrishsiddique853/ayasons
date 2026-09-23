import ProductCategoryPage from './shared/ProductCategoryPage'

import accessoriesImage from '../../assets/images/accessories.png'


const collections = [
  {
    title: 'Accessories',

    description:
      'Custom bags and accessories manufactured for sports teams, brands, travel, training and retail collections.',

    image: accessoriesImage,

    groups: [
      {
        title: 'Accessories Collection',

        items: [
          'Kit Bags',
          'Duffle Bags',
          'Back Packs',
          'Socks',
        ],
      },
    ],
  },
]


const products = [
  {
    title: 'Kit Bags',

    description:
      'Custom kit bags designed for teams and athletes to carry uniforms, footwear and training essentials.',

    image: accessoriesImage,

    features: [
      'Custom Colors',
      'Logo Branding',
      'Custom Compartments',
    ],
  },

  {
    title: 'Duffle Bags',

    description:
      'Durable custom duffle bags developed for gym use, sports teams, travel and branded merchandise collections.',

    image: accessoriesImage,

    features: [
      'Custom Branding',
      'Durable Materials',
      'Custom Sizes',
    ],
  },

  {
    title: 'Back Packs',

    description:
      'Custom backpacks designed for daily use, sports teams, travel and promotional brand collections.',

    image: accessoriesImage,

    features: [
      'Custom Colors',
      'Logo Branding',
      'Storage Options',
    ],
  },

  {
    title: 'Socks',

    description:
      'Custom sports and lifestyle socks produced with coordinated colors, branding and performance-focused construction.',

    image: accessoriesImage,

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },
]


function Accessories() {
  return (
    <ProductCategoryPage
      eyebrow="Accessories"

      title="Accessories Built Around Your Brand"

      description="Custom kit bags, duffle bags, backpacks and socks manufactured for sports teams, brands and retail collections."

      image={accessoriesImage}

      collections={collections}

      galleryEyebrow="Accessories Showcase"

      galleryTitle="Explore The Collection"

      products={products}
    />
  )
}

export default Accessories