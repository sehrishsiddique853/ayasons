import 'dotenv/config'

import mongoose from 'mongoose'
import path from 'path'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'

import connectDB from '../config/db.js'
import cloudinary from '../config/cloudinary.js'

import Category from '../models/Category.js'
import Product from '../models/Product.js'


const __filename =
  fileURLToPath(import.meta.url)

const __dirname =
  path.dirname(__filename)


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const slugify = (value = '') => {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}


/*
|--------------------------------------------------------------------------
| Existing Category Images
|--------------------------------------------------------------------------
*/

const categoryImageFiles = {
  activewear:
    'category-performance-wear.png',

  sportswear:
    'category-sports-teamwear.png',

  streetwear:
    'category-lifestyle-accessories.png',

  workwear:
    'workwear.png',

  'varsity-jackets':
    'versity_jackets.png',

  headwear:
    'headwear.png',

  accessories:
    'accessories.png',
}


/*
|--------------------------------------------------------------------------
| Validate Cloudinary
|--------------------------------------------------------------------------
*/

const validateCloudinaryConfig = () => {
  const requiredVariables = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ]

  const missingVariables =
    requiredVariables.filter(
      (variable) =>
        !process.env[variable]
    )

  if (missingVariables.length) {
    throw new Error(
      `Missing Cloudinary environment variables: ${missingVariables.join(', ')}`
    )
  }
}


/*
|--------------------------------------------------------------------------
| Resolve Existing React Image
|--------------------------------------------------------------------------
*/

const getCategoryImagePath = (
  fileName
) => {
  const imagePath =
    path.resolve(
      __dirname,
      '../../../client/src/assets/images',
      fileName
    )

  if (!existsSync(imagePath)) {
    throw new Error(
      `Category image not found: ${imagePath}`
    )
  }

  return imagePath
}


/*
|--------------------------------------------------------------------------
| Upload Category Images To Cloudinary
|--------------------------------------------------------------------------
*/

const uploadCategoryImages = async (
  categorySlug
) => {
  const fileName =
    categoryImageFiles[
      categorySlug
    ]

  if (!fileName) {
    console.warn(
      `No seed image configured for: ${categorySlug}`
    )

    return {
      heroImage: {
        url: '',
        publicId: '',
      },

      collectionImage: {
        url: '',
        publicId: '',
      },
    }
  }


  const imagePath =
    getCategoryImagePath(
      fileName
    )


  /*
  |--------------------------------------------------------------------------
  | Hero Image
  |--------------------------------------------------------------------------
  */

  const heroUpload =
    await cloudinary.uploader.upload(
      imagePath,
      {
        folder:
          `ayosons/categories/${categorySlug}`,

        public_id:
          'hero',

        resource_type:
          'image',

        overwrite:
          true,

        invalidate:
          true,
      }
    )


  /*
  |--------------------------------------------------------------------------
  | Collection Image
  |--------------------------------------------------------------------------
  */

  const collectionUpload =
    await cloudinary.uploader.upload(
      imagePath,
      {
        folder:
          `ayosons/categories/${categorySlug}`,

        public_id:
          'collection',

        resource_type:
          'image',

        overwrite:
          true,

        invalidate:
          true,
      }
    )


  return {
    heroImage: {
      url:
        heroUpload.secure_url,

      publicId:
        heroUpload.public_id,
    },

    collectionImage: {
      url:
        collectionUpload.secure_url,

      publicId:
        collectionUpload.public_id,
    },
  }
}


/*
|--------------------------------------------------------------------------
| Existing AYOSONS Data
|--------------------------------------------------------------------------
*/

const categoryData = [

  /*
  |--------------------------------------------------------------------------
  | ACTIVEWEAR
  |--------------------------------------------------------------------------
  */

  {
    name: 'Activewear',

    slug: 'activewear',

    eyebrow: 'Activewear',

    showcaseLabel: 'Gym & Fitness',

    heroTitle:
      'Performance Made For Movement',

    description:
      'Custom gym, fitness and activewear manufactured for brands, studios and performance-focused collections.',

    collectionDescription:
      'Custom gym, fitness and performance apparel developed for men and women, with flexible branding, sizing and manufacturing options.',

    groups: [
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
    ],

    order: 1,

    products: [
      {
        name:
          "Men's Tops / T-Shirts",

        group: 'Men',

        description:
          'Performance-focused tops designed for training, fitness and everyday active use.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          "Men's Bottoms / Trousers",

        group: 'Men',

        description:
          'Comfortable performance bottoms developed for movement, training and active lifestyles.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          "Men's Tank Tops",

        group: 'Men',

        description:
          'Lightweight training tank tops designed for fitness, gym and performance collections.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          "Men's Shorts",

        group: 'Men',

        description:
          'Custom performance shorts built for training, movement and everyday athletic use.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Compression Wear',

        group: 'Men',

        description:
          'Performance compression tops, bottoms and shorts developed for active and training use.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          "Women's Tops / T-Shirts",

        group: 'Women',

        description:
          'Custom performance tops designed around comfort, flexibility and active movement.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          "Women's Bottoms / Trousers",

        group: 'Women',

        description:
          'Performance bottoms developed for gym, fitness, training and activewear collections.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          "Women's Tank Tops",

        group: 'Women',

        description:
          'Lightweight activewear tank tops designed for movement, comfort and training.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          "Women's Sports Bras",

        group: 'Women',

        description:
          'Performance sports bras created for fitness, studio training and activewear brands.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          "Women's Shorts",

        group: 'Women',

        description:
          "Custom women's training shorts developed for active performance and everyday fitness.",

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name: 'Leggings',

        group: 'Women',

        description:
          'Performance leggings designed for gym, training, fitness and active lifestyle collections.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },
    ],
  },


  /*
  |--------------------------------------------------------------------------
  | SPORTSWEAR
  |--------------------------------------------------------------------------
  */

  {
    name: 'Sportswear',

    slug: 'sportswear',

    eyebrow: 'Sportswear',

    showcaseLabel: 'Team & Performance',

    heroTitle:
      'Built For Teams And Performance',

    description:
      'Custom sports uniforms and performance apparel manufactured for teams, clubs, academies and sportswear brands.',

    collectionDescription:
      'Custom sports uniforms and performance apparel manufactured for teams, clubs, academies and sportswear brands.',

    groups: [
      {
        title:
          'Sportswear Collection',

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

    order: 2,

    products: [
      {
        name:
          'Soccer Uniform',

        description:
          'Custom soccer jerseys and shorts designed for team identity, movement and match-day performance.',

        features: [
          'Custom Colors',
          'Team Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'American Football Uniform',

        description:
          'Durable American football uniforms developed for training, competition and full-team customization.',

        features: [
          'Custom Graphics',
          'Team Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Baseball Uniform',

        description:
          'Custom baseball jerseys and pants built for comfort, durability and consistent club branding.',

        features: [
          'Custom Colors',
          'Logo Placement',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Basketball Uniform',

        description:
          'Lightweight basketball jerseys and shorts designed for unrestricted movement and team presentation.',

        features: [
          'Breathable Fabric',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Cricket Uniform',

        description:
          'Custom cricket shirts, trousers and team kits manufactured for clubs, academies and competitive teams.',

        features: [
          'Team Colors',
          'Logo Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Ice Hockey Uniform',

        description:
          'Custom ice hockey jerseys developed with room for protective equipment and bold team graphics.',

        features: [
          'Custom Graphics',
          'Team Logos',
          'Custom Sizing',
        ],
      },

      {
        name:
          'Netball Uniform',

        description:
          'Performance netball uniforms designed for comfort, mobility and coordinated team presentation.',

        features: [
          'Custom Colors',
          'Team Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Rugby Uniform',

        description:
          'Durable rugby jerseys and shorts manufactured for demanding match conditions and team performance.',

        features: [
          'Durable Fabric',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Volleyball Uniform',

        description:
          'Lightweight volleyball jerseys and shorts designed for flexibility, comfort and fast-paced movement.',

        features: [
          'Lightweight Fabric',
          'Team Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Softball Uniform',

        description:
          'Custom softball uniforms created for team consistency, comfort and performance during games and training.',

        features: [
          'Custom Colors',
          'Logo Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Cheerleaders Uniform',

        description:
          'Custom cheer uniforms designed around team colors, coordinated styling and freedom of movement.',

        features: [
          'Custom Design',
          'Team Colors',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Lacrosse Uniform',

        description:
          'Performance lacrosse jerseys and shorts developed for mobility, team branding and competitive play.',

        features: [
          'Performance Fabric',
          'Custom Graphics',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Swimming Suits',

        description:
          'Custom swimwear developed for training, competition and club identity with performance-focused construction.',

        features: [
          'Performance Fit',
          'Custom Colors',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Polo T-Shirts',

        description:
          'Custom polo shirts suitable for teams, clubs, staff uniforms and branded sportswear collections.',

        features: [
          'Custom Colors',
          'Logo Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Training Suits / Tracksuits',

        description:
          'Custom tracksuits designed for warm-ups, travel, training sessions and complete team presentation.',

        features: [
          'Team Branding',
          'Custom Colors',
          'Custom Sizes',
        ],
      },
    ],
  },


  /*
  |--------------------------------------------------------------------------
  | STREETWEAR
  |--------------------------------------------------------------------------
  */

  {
    name: 'Streetwear',

    slug: 'streetwear',

    eyebrow: 'Streetwear',

    showcaseLabel: 'Lifestyle Apparel',

    heroTitle:
      'Lifestyle Apparel With A Custom Edge',

    description:
      'Custom hoodies, tracksuits, denim, T-shirts and lifestyle apparel manufactured for private-label brands and retail collections.',

    collectionDescription:
      'Custom streetwear and lifestyle apparel manufactured for brands, private-label collections and everyday wear.',

    groups: [
      {
        title:
          'Streetwear Collection',

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

    order: 3,

    products: [
      {
        name: 'Hoodies',

        description:
          'Custom hoodies designed for streetwear labels, lifestyle collections and private-label brands with flexible fabric and branding options.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name: 'Trousers',

        description:
          'Custom streetwear trousers developed for comfortable everyday wear with brand-specific styling and finishing.',

        features: [
          'Custom Fit',
          'Custom Branding',
          'Custom Colors',
        ],
      },

      {
        name: 'T-Shirts',

        description:
          'Custom T-shirts manufactured for lifestyle brands, merchandise collections and private-label streetwear programs.',

        features: [
          'Custom Prints',
          'Custom Labels',
          'Custom Sizes',
        ],
      },

      {
        name: 'Tracksuits',

        description:
          'Matching custom tracksuits created for lifestyle collections, teams and brands that want coordinated tops and bottoms.',

        features: [
          'Matching Sets',
          'Custom Branding',
          'Custom Colors',
        ],
      },

      {
        name: 'Sweatsuits',

        description:
          'Comfort-focused sweatsuits developed for casual collections with coordinated styling and custom brand details.',

        features: [
          'Custom Fabric',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name: 'Sweat Pant',

        description:
          'Custom sweat pants designed for relaxed everyday wear, training and lifestyle-focused apparel collections.',

        features: [
          'Custom Fit',
          'Logo Branding',
          'Custom Colors',
        ],
      },

      {
        name: 'Sweat Shirt',

        description:
          'Custom sweatshirts manufactured for casual and streetwear collections with flexible decoration and finishing options.',

        features: [
          'Custom Prints',
          'Embroidery',
          'Custom Colors',
        ],
      },

      {
        name: 'Shorts',

        description:
          'Custom casual shorts designed for streetwear, warm-weather collections and comfortable everyday use.',

        features: [
          'Custom Fit',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          '3 Quarter Shorts',

        description:
          'Three-quarter shorts manufactured for relaxed lifestyle collections with customizable fits, colors and brand details.',

        features: [
          'Custom Fit',
          'Custom Colors',
          'Logo Branding',
        ],
      },

      {
        name:
          'Windbreaker Sets',

        description:
          'Lightweight windbreaker sets developed for outerwear, travel and coordinated streetwear collections.',

        features: [
          'Lightweight Fabric',
          'Custom Branding',
          'Custom Colors',
        ],
      },

      {
        name:
          'Denim Jeans Pants',

        description:
          'Custom denim jeans manufactured for lifestyle and streetwear collections with brand-led fits, washes and detailing.',

        features: [
          'Custom Fit',
          'Custom Details',
          'Private Labels',
        ],
      },

      {
        name:
          'Denim Shorts',

        description:
          'Custom denim shorts created for casual and seasonal collections with flexible washes, trims and branding.',

        features: [
          'Custom Wash',
          'Custom Branding',
          'Custom Fit',
        ],
      },

      {
        name:
          'Tank Tops',

        description:
          'Custom tank tops developed for casual, summer and lifestyle collections with brand-specific colors and finishing.',

        features: [
          'Custom Colors',
          'Custom Prints',
          'Custom Sizes',
        ],
      },
    ],
  },


  /*
  |--------------------------------------------------------------------------
  | WORKWEAR
  |--------------------------------------------------------------------------
  */

  {
    name: 'Workwear',

    slug: 'workwear',

    eyebrow: 'Workwear',

    showcaseLabel: 'Professional Apparel',


    heroTitle:
      'Professional Apparel Built To Last',

    description:
      'Custom suits, jackets and pants manufactured for companies, staff teams and professional uniform programs.',

    collectionDescription:
      'Professional workwear manufactured for companies, teams and organizations requiring reliable branded apparel.',

    groups: [
      {
        title:
          'Workwear Collection',

        items: [
          'Suits',
          'Jackets',
          'Pants',
        ],
      },
    ],

    order: 4,

    products: [
      {
        name: 'Suits',

        description:
          'Custom professional suits developed for corporate teams, staff uniforms and organizations requiring a coordinated appearance.',

        features: [
          'Custom Fit',
          'Custom Colors',
          'Brand Identity',
        ],
      },

      {
        name: 'Jackets',

        description:
          'Custom work jackets manufactured for professional use with durable construction and company branding options.',

        features: [
          'Durable Fabric',
          'Logo Branding',
          'Custom Sizes',
        ],
      },

      {
        name: 'Pants',

        description:
          'Professional work pants designed for everyday comfort, durability and consistency across company uniform programs.',

        features: [
          'Custom Fit',
          'Durable Fabric',
          'Custom Sizes',
        ],
      },
    ],
  },


  /*
  |--------------------------------------------------------------------------
  | VARSITY JACKETS
  |--------------------------------------------------------------------------
  */

  {
    name:
      'Varsity Jackets',

    slug:
      'varsity-jackets',

    eyebrow:
      'Varsity Jackets',

      showcaseLabel: 'Premium Outerwear',


    heroTitle:
      'Custom Jackets With Statement Detail',

    description:
      'Custom wool-leather, satin, fleece, bomber, puffer and softshell jackets manufactured for brands, schools and teams.',

    collectionDescription:
      'Custom varsity and outerwear jackets manufactured for schools, clubs, brands and private-label collections.',

    groups: [
      {
        title:
          'Jacket Collection',

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

    order: 5,

    products: [
      {
        name:
          'Wool-Leather',

        description:
          'Classic varsity jackets combining wool bodies with leather sections for a premium school, club or brand-focused finish.',

        features: [
          'Custom Colors',
          'Custom Patches',
          'Custom Sizes',
        ],
      },

      {
        name: 'Satin',

        description:
          'Lightweight satin jackets designed for fashion, team and lifestyle collections with a smooth branded finish.',

        features: [
          'Custom Colors',
          'Embroidery',
          'Custom Branding',
        ],
      },

      {
        name:
          'Cotton Fleece',

        description:
          'Comfortable cotton fleece jackets developed for casual outerwear collections, clubs and branded apparel programs.',

        features: [
          'Soft Fabric',
          'Custom Branding',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Bomper Jacket',

        description:
          'Custom bomber-style jackets manufactured for streetwear, team and lifestyle collections with flexible trim and branding options.',

        features: [
          'Custom Ribbing',
          'Custom Branding',
          'Custom Colors',
        ],
      },

      {
        name:
          'Puffer Jacket',

        description:
          'Insulated custom puffer jackets designed for colder conditions, outdoor use and branded winter collections.',

        features: [
          'Insulated Build',
          'Custom Branding',
          'Custom Colors',
        ],
      },

      {
        name:
          'Softshell Jacket',

        description:
          'Versatile softshell jackets developed for teams, businesses and outdoor collections requiring lightweight protection and comfort.',

        features: [
          'Lightweight',
          'Custom Logos',
          'Custom Sizes',
        ],
      },
    ],
  },


  /*
  |--------------------------------------------------------------------------
  | HEADWEAR
  |--------------------------------------------------------------------------
  */

  {
    name: 'Headwear',

    slug: 'headwear',

    eyebrow: 'Headwear',

    showcaseLabel: 'Custom Headwear',

    heroTitle:
      'Custom Headwear For Every Collection',

    description:
      'Custom beanies, caps and hats manufactured for sports teams, streetwear labels and branded merchandise programs.',

    collectionDescription:
      'Custom caps, hats and beanies manufactured for brands, teams, merchandise programs and retail collections.',

    groups: [
      {
        title:
          'Headwear Collection',

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

    order: 6,

    products: [
      {
        name: 'Beanies',

        description:
          'Custom beanies developed for cold-weather collections, teams, streetwear brands and branded merchandise.',

        features: [
          'Custom Colors',
          'Logo Branding',
          'Custom Knit',
        ],
      },

      {
        name:
          'Bucket Hat',

        description:
          'Custom bucket hats designed for lifestyle collections, streetwear brands, teams and promotional merchandise.',

        features: [
          'Custom Colors',
          'Embroidery',
          'Custom Branding',
        ],
      },

      {
        name:
          'Trucker Hat',

        description:
          'Custom trucker hats combining structured front panels with breathable mesh for casual and promotional collections.',

        features: [
          'Custom Colors',
          'Logo Branding',
          'Mesh Options',
        ],
      },

      {
        name:
          'Baseball Cap',

        description:
          'Classic custom baseball caps manufactured for sports teams, brands, staff uniforms and retail merchandise.',

        features: [
          'Custom Embroidery',
          'Adjustable Fit',
          'Custom Colors',
        ],
      },

      {
        name:
          'Visor Cap',

        description:
          'Custom visor caps designed for outdoor sports, training, golf, tennis and lightweight teamwear collections.',

        features: [
          'Custom Colors',
          'Logo Branding',
          'Adjustable Fit',
        ],
      },

      {
        name:
          'Jeep Cap',

        description:
          'Custom jeep caps developed for warm, casual and outdoor collections with branded detailing and flexible styling.',

        features: [
          'Custom Knit',
          'Brand Labels',
          'Custom Colors',
        ],
      },

      {
        name:
          'Snapback Cap',

        description:
          'Structured custom snapback caps designed for streetwear, sports teams, merchandise and private-label collections.',

        features: [
          'Custom Embroidery',
          'Snap Closure',
          'Custom Colors',
        ],
      },
    ],
  },


  /*
  |--------------------------------------------------------------------------
  | ACCESSORIES
  |--------------------------------------------------------------------------
  */

  {
    name: 'Accessories',

    slug: 'accessories',

    eyebrow: 'Accessories',

    showcaseLabel: 'Bags & Accessories',

    heroTitle:
      'Accessories Built Around Your Brand',

    description:
      'Custom kit bags, duffle bags, backpacks and socks manufactured for sports teams, brands and retail collections.',

    collectionDescription:
      'Custom bags and accessories manufactured for sports teams, brands, travel, training and retail collections.',

    groups: [
      {
        title:
          'Accessories Collection',

        items: [
          'Kit Bags',
          'Duffle Bags',
          'Back Packs',
          'Socks',
        ],
      },
    ],

    order: 7,

    products: [
      {
        name: 'Kit Bags',

        description:
          'Custom kit bags designed for teams and athletes to carry uniforms, footwear and training essentials.',

        features: [
          'Custom Colors',
          'Logo Branding',
          'Custom Compartments',
        ],
      },

      {
        name:
          'Duffle Bags',

        description:
          'Durable custom duffle bags developed for gym use, sports teams, travel and branded merchandise collections.',

        features: [
          'Custom Branding',
          'Durable Materials',
          'Custom Sizes',
        ],
      },

      {
        name:
          'Back Packs',

        description:
          'Custom backpacks designed for daily use, sports teams, travel and promotional brand collections.',

        features: [
          'Custom Colors',
          'Logo Branding',
          'Storage Options',
        ],
      },

      {
        name: 'Socks',

        description:
          'Custom sports and lifestyle socks produced with coordinated colors, branding and performance-focused construction.',

        features: [
          'Custom Colors',
          'Custom Branding',
          'Custom Sizes',
        ],
      },
    ],
  },
]


/*
|--------------------------------------------------------------------------
| Seed Database
|--------------------------------------------------------------------------
*/

const seedDatabase = async () => {
  try {

    /*
    |--------------------------------------------------------------------------
    | Validate Services
    |--------------------------------------------------------------------------
    */

    validateCloudinaryConfig()

    await connectDB()


    console.log(
      'Starting AYOSONS database seed...'
    )

    console.log(
      'Uploading category images to Cloudinary...'
    )


    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    for (
      const categoryInput
      of categoryData
    ) {
      const {
        products,
        ...categoryFields
      } = categoryInput


      /*
      |--------------------------------------------------------------------------
      | Upload Images
      |--------------------------------------------------------------------------
      */

      const {
        heroImage,
        collectionImage,
      } =
        await uploadCategoryImages(
          categoryFields.slug
        )


      console.log(
        `Cloudinary images ready: ${categoryFields.name}`
      )


      /*
      |--------------------------------------------------------------------------
      | Upsert Category
      |--------------------------------------------------------------------------
      */

      const category =
        await Category.findOneAndUpdate(
          {
            slug:
              categoryFields.slug,
          },

          {
            ...categoryFields,

            /*
            | These two were missing
            | from your current code.
            */

            heroImage,

            collectionImage,

            active: true,
          },

          {
            new: true,

            upsert: true,

            runValidators: true,

            setDefaultsOnInsert: true,
          }
        )


      console.log(
        `Category ready: ${category.name}`
      )


      /*
      |--------------------------------------------------------------------------
      | Products
      |--------------------------------------------------------------------------
      */

      for (
        let index = 0;
        index < products.length;
        index += 1
      ) {
        const product =
          products[index]


        const productSlug =
          slugify(
            product.name
          )


        let productGroup =
          product.group || ''


        /*
        |--------------------------------------------------------------------------
        | Automatically Use Single Category Group
        |--------------------------------------------------------------------------
        */

        if (
          !productGroup &&
          category.groups.length === 1
        ) {
          productGroup =
            category.groups[0].title
        }


        /*
        |--------------------------------------------------------------------------
        | Upsert Product
        |--------------------------------------------------------------------------
        */

        await Product.findOneAndUpdate(
          {
            category:
              category._id,

            slug:
              productSlug,
          },

          {
            name:
              product.name,

            slug:
              productSlug,

            category:
              category._id,

            group:
              productGroup,

            description:
              product.description,

            features:
              product.features || [],


            /*
            |--------------------------------------------------------------------------
            | Temporary Product Image
            |--------------------------------------------------------------------------
            |
            | Existing frontend currently uses the same category image for
            | all products inside that category.
            |
            | We therefore use the Cloudinary category collection image.
            |
            | publicId stays empty because the product does NOT own this
            | Cloudinary asset.
            |
            */

            image: {
              url:
                collectionImage.url,

              publicId: '',
            },


            active: true,

            order:
              index + 1,
          },

          {
            new: true,

            upsert: true,

            runValidators: true,

            setDefaultsOnInsert: true,
          }
        )
      }


      console.log(
        `Products ready: ${products.length}`
      )
    }


    /*
    |--------------------------------------------------------------------------
    | Final Counts
    |--------------------------------------------------------------------------
    */

    const categoryCount =
      await Category.countDocuments()

    const productCount =
      await Product.countDocuments()


    console.log(
      '\nSeed completed successfully.'
    )

    console.log(
      `Categories: ${categoryCount}`
    )

    console.log(
      `Products: ${productCount}`
    )

  } catch (error) {

    console.error(
      '\nSeed failed:',
      error
    )

    process.exitCode = 1

  } finally {

    /*
    |--------------------------------------------------------------------------
    | Close MongoDB
    |--------------------------------------------------------------------------
    */

    if (
      mongoose.connection.readyState !== 0
    ) {
      await mongoose.connection.close()

      console.log(
        'MongoDB connection closed.'
      )
    }
  }
}


seedDatabase()