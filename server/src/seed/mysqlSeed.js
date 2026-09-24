import 'dotenv/config'

import pool from '../config/mysql.js'

import {
  categoryData,
  categoryImageFiles,
  slugify,
} from './seedData.js'


/*
|--------------------------------------------------------------------------
| Local Image URL
|--------------------------------------------------------------------------
|
| We are no longer storing Cloudinary URLs in MySQL.
|
| The real files will be copied into:
|
| server/uploads/categories/
|
| in the NEXT migration step.
|
*/

const getCategoryImageUrl = (
  categorySlug
) => {
  const fileName =
    categoryImageFiles[
      categorySlug
    ]

  if (!fileName) {
    return ''
  }

  return `/uploads/categories/${fileName}`
}


/*
|--------------------------------------------------------------------------
| Seed MySQL
|--------------------------------------------------------------------------
*/

const seedMySQL = async () => {
  let connection


  try {
    console.log(
      'Connecting to MySQL...'
    )


    connection =
      await pool.getConnection()


    await connection.beginTransaction()


    console.log(
      'Starting AYOSONS MySQL seed...'
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
        ...category
      } = categoryInput


      const imageUrl =
        getCategoryImageUrl(
          category.slug
        )


      /*
      |--------------------------------------------------------------------------
      | Insert / Update Category
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

          name =
            VALUES(name),

          eyebrow =
            VALUES(eyebrow),

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
          category.name,

          category.slug,

          category.eyebrow || '',

          category.showcaseLabel || '',

          category.heroTitle,

          category.description,

          category.collectionDescription ||
            '',

          imageUrl,

          imageUrl,

          JSON.stringify(
            category.groups || []
          ),

          1,

          category.order || 0,
        ]
      )


      /*
      |--------------------------------------------------------------------------
      | Get Category ID
      |--------------------------------------------------------------------------
      */

      const [
        categoryRows,
      ] =
        await connection.execute(
          `
          SELECT id
          FROM categories
          WHERE slug = ?
          LIMIT 1
          `,
          [
            category.slug,
          ]
        )


      if (
        categoryRows.length === 0
      ) {
        throw new Error(
          `Unable to find MySQL category after insert: ${category.slug}`
        )
      }


      const categoryId =
        categoryRows[0].id


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
        index <
        products.length;
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
        | Automatically Assign Single Group
        |--------------------------------------------------------------------------
        */

        if (
          !productGroup &&
          category.groups?.length ===
            1
        ) {
          productGroup =
            category.groups[0].title
        }


        /*
        |--------------------------------------------------------------------------
        | Insert / Update Product
        |--------------------------------------------------------------------------
        */

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

            productSlug,

            productGroup,

            product.description,

            imageUrl,

            JSON.stringify(
              product.features || []
            ),

            product.featured
              ? 1
              : 0,

            1,

            index + 1,
          ]
        )
      }


      console.log(
        `Products ready: ${products.length}`
      )
    }


    /*
    |--------------------------------------------------------------------------
    | Commit
    |--------------------------------------------------------------------------
    */

    await connection.commit()


    /*
    |--------------------------------------------------------------------------
    | Counts
    |--------------------------------------------------------------------------
    */

    const [
      categoryCountRows,
    ] =
      await connection.execute(
        `
        SELECT COUNT(*) AS total
        FROM categories
        `
      )


    const [
      productCountRows,
    ] =
      await connection.execute(
        `
        SELECT COUNT(*) AS total
        FROM products
        `
      )


    console.log(
      '\nMySQL seed completed successfully.'
    )


    console.log(
      `Categories: ${categoryCountRows[0].total}`
    )


    console.log(
      `Products: ${productCountRows[0].total}`
    )

  } catch (error) {

    if (connection) {
      await connection.rollback()
    }


    console.error(
      '\nMySQL seed failed:'
    )


    console.error(
      error
    )


    process.exitCode = 1

  } finally {

    if (connection) {
      connection.release()
    }


    await pool.end()


    console.log(
      'MySQL connection closed.'
    )
  }
}


seedMySQL()