import 'dotenv/config'

import pool from '../config/mysql.js'


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


const createTestCategory =
  async (connection) => {
    /*
    |--------------------------------------------------------------------------
    | Reuse Activewear Local Image
    |--------------------------------------------------------------------------
    */

    const [sourceRows] =
      await connection.execute(
        `
        SELECT
          hero_image,
          collection_image
        FROM categories
        WHERE
          slug = ?
          AND active = 1
        LIMIT 1
        `,
        ['activewear']
      )


    if (
      sourceRows.length === 0
    ) {
      throw new Error(
        'Activewear category not found. Run npm run seed first.'
      )
    }


    const sourceCategory =
      sourceRows[0]


    const groups = [
      {
        title:
          'Shoes Collection',

        items: [
          'Running Shoes',
          'Training Shoes',
          'Football Shoes',
        ],
      },
    ]


    /*
    |--------------------------------------------------------------------------
    | Create / Update Shoes
    |--------------------------------------------------------------------------
    */

    await connection.execute(
      `
      INSERT INTO categories (
        name,
        slug,
        eyebrow,
        showcase_label,
        hero_title,
        description,
        collection_description,
        hero_image,
        collection_image,
        groups_json,
        active,
        display_order
      )

      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )

      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        eyebrow = VALUES(eyebrow),
        showcase_label =
          VALUES(showcase_label),
        hero_title =
          VALUES(hero_title),
        description =
          VALUES(description),
        collection_description =
          VALUES(collection_description),
        hero_image =
          VALUES(hero_image),
        collection_image =
          VALUES(collection_image),
        groups_json =
          VALUES(groups_json),
        active =
          VALUES(active),
        display_order =
          VALUES(display_order)
      `,
      [
        'Shoes',
        'shoes',
        'Footwear',
        'Custom Footwear',

        'Performance Footwear Built For Your Brand',

        'Custom sports and performance footwear developed for teams, brands and private-label collections.',

        'Custom footwear manufactured for training, sports and lifestyle collections with flexible branding options.',

        sourceCategory.hero_image,

        sourceCategory.collection_image,

        JSON.stringify(
          groups
        ),

        1,

        999,
      ]
    )


    /*
    |--------------------------------------------------------------------------
    | Get Shoes ID
    |--------------------------------------------------------------------------
    */

    const [categoryRows] =
      await connection.execute(
        `
        SELECT id
        FROM categories
        WHERE slug = ?
        LIMIT 1
        `,
        ['shoes']
      )


    const categoryId =
      categoryRows[0].id


    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */

    for (
      let index = 0;
      index <
      testProducts.length;
      index += 1
    ) {
      const product =
        testProducts[index]


      await connection.execute(
        `
        INSERT INTO products (
          category_id,
          name,
          slug,
          group_name,
          description,
          image,
          features_json,
          featured,
          active,
          display_order
        )

        VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )

        ON DUPLICATE KEY UPDATE
          name =
            VALUES(name),

          group_name =
            VALUES(group_name),

          description =
            VALUES(description),

          image =
            VALUES(image),

          features_json =
            VALUES(features_json),

          featured =
            VALUES(featured),

          active =
            VALUES(active),

          display_order =
            VALUES(display_order)
        `,
        [
          categoryId,

          product.name,

          product.slug,

          'Shoes Collection',

          product.description,

          sourceCategory
            .collection_image,

          JSON.stringify(
            product.features
          ),

          0,

          1,

          index + 1,
        ]
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
  async (connection) => {
    /*
    |--------------------------------------------------------------------------
    | Count Test Products
    |--------------------------------------------------------------------------
    */

    const [productRows] =
      await connection.execute(
        `
        SELECT COUNT(*) AS total

        FROM products p

        INNER JOIN categories c
          ON c.id = p.category_id

        WHERE c.slug = ?
        `,
        ['shoes']
      )


    const productCount =
      productRows[0].total


    /*
    |--------------------------------------------------------------------------
    | Delete Category
    |--------------------------------------------------------------------------
    |
    | Products are automatically deleted because our foreign key uses:
    |
    | ON DELETE CASCADE
    |
    */

    const [result] =
      await connection.execute(
        `
        DELETE FROM categories
        WHERE slug = ?
        `,
        ['shoes']
      )


    if (
      result.affectedRows === 0
    ) {
      console.log(
        'Shoes test category does not exist.'
      )

      return
    }


    console.log(
      'Dynamic test category removed.'
    )

    console.log(
      `Products removed: ${productCount}`
    )
  }


const run = async () => {
  let connection


  try {
    connection =
      await pool.getConnection()


    await connection.beginTransaction()


    if (
      ACTION === 'create'
    ) {
      await createTestCategory(
        connection
      )

    } else if (
      ACTION === 'remove'
    ) {
      await removeTestCategory(
        connection
      )

    } else {
      throw new Error(
        'Invalid action. Use create or remove.'
      )
    }


    await connection.commit()

  } catch (error) {

    if (connection) {
      await connection.rollback()
    }


    console.error(
      'Dynamic category test failed:',
      error
    )


    process.exitCode = 1

  } finally {

    if (connection) {
      connection.release()
    }


    await pool.end()
  }
}


run()