import ProductCategoryPage from './shared/ProductCategoryPage'

import sportsImage from '../../assets/images/optimized/category-sports-teamwear.jpg'


const collections = [
  {
    title: 'Sports Wear',

    description:
      'Custom sports uniforms and performance apparel manufactured for teams, clubs, academies and sportswear brands.',

    image: sportsImage,

    groups: [
      {
        title: 'Sportswear Collection',

        items: [
          'Soccer Uniform',
          'American Football Uniform',
          'Baseball Uniform',
          'Basketball Uniform',
          'Cricket Uniform',
          'Ice Hockey Uniform',
          'Netball Uniform',
          'Rugby Uniform',
          'Volleyball Uniform',
          'Softball Uniform',
          'Cheerleaders Uniform',
          'Lacrosse Uniform',
          'Swimming Suits',
          'Polo T-Shirts',
          'Training Suits / Tracksuits',
        ],
      },
    ],
  },
]

const products = [
  {
    title: 'Soccer Uniform',
    description:
      'Custom soccer jerseys and shorts designed for team identity, movement and match-day performance.',
    image: sportsImage,
    features: [
      'Custom Colors',
      'Team Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'American Football Uniform',
    description:
      'Durable American football uniforms developed for training, competition and full-team customization.',
    image: sportsImage,
    features: [
      'Custom Graphics',
      'Team Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Baseball Uniform',
    description:
      'Custom baseball jerseys and pants built for comfort, durability and consistent club branding.',
    image: sportsImage,
    features: [
      'Custom Colors',
      'Logo Placement',
      'Custom Sizes',
    ],
  },

  {
    title: 'Basketball Uniform',
    description:
      'Lightweight basketball jerseys and shorts designed for unrestricted movement and team presentation.',
    image: sportsImage,
    features: [
      'Breathable Fabric',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Cricket Uniform',
    description:
      'Custom cricket shirts, trousers and team kits manufactured for clubs, academies and competitive teams.',
    image: sportsImage,
    features: [
      'Team Colors',
      'Logo Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Ice Hockey Uniform',
    description:
      'Custom ice hockey jerseys developed with room for protective equipment and bold team graphics.',
    image: sportsImage,
    features: [
      'Custom Graphics',
      'Team Logos',
      'Custom Sizing',
    ],
  },

  {
    title: 'Netball Uniform',
    description:
      'Performance netball uniforms designed for comfort, mobility and coordinated team presentation.',
    image: sportsImage,
    features: [
      'Custom Colors',
      'Team Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Rugby Uniform',
    description:
      'Durable rugby jerseys and shorts manufactured for demanding match conditions and team performance.',
    image: sportsImage,
    features: [
      'Durable Fabric',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Volleyball Uniform',
    description:
      'Lightweight volleyball jerseys and shorts designed for flexibility, comfort and fast-paced movement.',
    image: sportsImage,
    features: [
      'Lightweight Fabric',
      'Team Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Softball Uniform',
    description:
      'Custom softball uniforms created for team consistency, comfort and performance during games and training.',
    image: sportsImage,
    features: [
      'Custom Colors',
      'Logo Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Cheerleaders Uniform',
    description:
      'Custom cheer uniforms designed around team colors, coordinated styling and freedom of movement.',
    image: sportsImage,
    features: [
      'Custom Design',
      'Team Colors',
      'Custom Sizes',
    ],
  },

  {
    title: 'Lacrosse Uniform',
    description:
      'Performance lacrosse jerseys and shorts developed for mobility, team branding and competitive play.',
    image: sportsImage,
    features: [
      'Performance Fabric',
      'Custom Graphics',
      'Custom Sizes',
    ],
  },

  {
    title: 'Swimming Suits',
    description:
      'Custom swimwear developed for training, competition and club identity with performance-focused construction.',
    image: sportsImage,
    features: [
      'Performance Fit',
      'Custom Colors',
      'Custom Sizes',
    ],
  },

  {
    title: 'Polo T-Shirts',
    description:
      'Custom polo shirts suitable for teams, clubs, staff uniforms and branded sportswear collections.',
    image: sportsImage,
    features: [
      'Custom Colors',
      'Logo Branding',
      'Custom Sizes',
    ],
  },

  {
    title: 'Training Suits / Tracksuits',
    description:
      'Custom tracksuits designed for warm-ups, travel, training sessions and complete team presentation.',
    image: sportsImage,
    features: [
      'Team Branding',
      'Custom Colors',
      'Custom Sizes',
    ],
  },
]


function Sportswear() {
  return (
    <ProductCategoryPage
      eyebrow="Sportswear"

      title="Built For Teams And Performance"

      description="Custom sports uniforms and performance apparel manufactured for teams, clubs, academies and sportswear brands."

      image={sportsImage}

      collections={collections}

      galleryEyebrow="Sportswear Showcase"

      galleryTitle="Explore The Collection"

      products={products}
    />
  )
}

export default Sportswear
