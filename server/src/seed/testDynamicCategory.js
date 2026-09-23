import 'dotenv/config'

import mongoose from 'mongoose'

import connectDB from '../config/db.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'


const ACTION =
  process.argv[2] || 'create'


const testProducts = [
  {
    name: 'Running Shoes',

    slug: 'running-shoes',

    description:
      'Custom running shoes developed for performance, training and branded footwear collections.',

    features: [
      'Custom Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    name: 'Training Shoes',

    slug: 'training-shoes',

    description:
      'Custom training shoes designed for gym, fitness and active performance collections.',

    features: [
      'Performance Design',
      'Custom Branding',
      'Custom Sizes',
    ],
  },

  {
    name: 'Football Shoes',

    slug: 'football-shoes',

    description:
      'Custom football footwear developed for teams, clubs and private-label sports collections.',

    features: [
      'Team Colors',
      'Custom Branding',
      'Custom Sizes',
    ],
  },
]


const createTestCategory = async () => {
  /*
  |--------------------------------------------------------------------------
  | Reuse An Existing Cloudinary Image
  |--------------------------------------------------------------------------
  |
  | This test is about dynamic routing, not image uploads.
  | We therefore reuse Activewear's already-uploaded Cloudinary image.
  |
  */

  const sourceCategory =
    await Category.findOne({
      slug: 'activewear',
      active: true,
    })


  if (!sourceCategory) {
    throw new Error(
      'Activewear category not found. Run the main seed first.'
    )
  }


  /*
  |--------------------------------------------------------------------------
  | Create / Update Shoes Category
  |--------------------------------------------------------------------------
  */

  const shoesCategory =
    await Category.findOneAndUpdate(
      {
        slug: 'shoes',
      },

      {
        name: 'Shoes',

        slug: 'shoes',

        eyebrow: 'Footwear',

        heroTitle:
          'Performance Footwear Built For Your Brand',

        description:
          'Custom sports and performance footwear developed for teams, brands and private-label collections.',

        collectionDescription:
          'Custom footwear manufactured for training, sports and lifestyle collections with flexible branding options.',

        heroImage: {
          url:
            sourceCategory.heroImage?.url ||
            '',

          publicId: '',
        },

        collectionImage: {
          url:
            sourceCategory.collectionImage?.url ||
            sourceCategory.heroImage?.url ||
            '',

          publicId: '',
        },

        groups: [
          {
            title:
              'Shoes Collection',

            items: [
              'Running Shoes',
              'Training Shoes',
              'Football Shoes',
            ],
          },
        ],

        active: true,

        order: 999,
      },

      {
        upsert: true,

        returnDocument:
          'after',

        runValidators:
          true,

        setDefaultsOnInsert:
          true,
      }
    )


  /*
  |--------------------------------------------------------------------------
  | Create Products
  |--------------------------------------------------------------------------
  */

  for (
    let index = 0;
    index < testProducts.length;
    index += 1
  ) {
    const product =
      testProducts[index]


    await Product.findOneAndUpdate(
      {
        category:
          shoesCategory._id,

        slug:
          product.slug,
      },

      {
        name:
          product.name,

        slug:
          product.slug,

        category:
          shoesCategory._id,

        group:
          'Shoes Collection',

        description:
          product.description,

        features:
          product.features,

        image: {
          url:
            shoesCategory
              .collectionImage
              ?.url || '',

          publicId: '',
        },

        featured: false,

        active: true,

        order:
          index + 1,
      },

      {
        upsert: true,

        returnDocument:
          'after',

        runValidators:
          true,

        setDefaultsOnInsert:
          true,
      }
    )
  }


  console.log(
    'Dynamic test category created successfully.'
  )

  console.log(
    'Category: Shoes'
  )

  console.log(
    'Slug: shoes'
  )

  console.log(
    `Products: ${testProducts.length}`
  )

  console.log(
    '\nOpen: http://localhost:5173/products/shoes'
  )
}


const removeTestCategory =
  async () => {
    const shoesCategory =
      await Category.findOne({
        slug: 'shoes',
      })


    if (!shoesCategory) {
      console.log(
        'Shoes test category does not exist.'
      )

      return
    }


    const productResult =
      await Product.deleteMany({
        category:
          shoesCategory._id,
      })


    await Category.deleteOne({
      _id:
        shoesCategory._id,
    })


    console.log(
      'Dynamic test category removed.'
    )

    console.log(
      `Products removed: ${productResult.deletedCount}`
    )
  }


const run = async () => {
  try {
    await connectDB()


    if (ACTION === 'create') {
      await createTestCategory()
    } else if (
      ACTION === 'remove'
    ) {
      await removeTestCategory()
    } else {
      throw new Error(
        'Invalid action. Use create or remove.'
      )
    }

  } catch (error) {

    console.error(
      'Dynamic category test failed:',
      error
    )

    process.exitCode = 1

  } finally {

    if (
      mongoose.connection.readyState !==
      0
    ) {
      await mongoose.connection.close()
    }
  }
}


run()