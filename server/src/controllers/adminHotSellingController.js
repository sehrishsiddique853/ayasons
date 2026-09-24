import pool from '../config/mysql.js'


const getBaseUrl = (
  req
) => {
  const configured =
    process.env.SERVER_URL
      ?.trim()
      ?.replace(/\/+$/, '')

  return (
    configured ||
    `${req.protocol}://${req.get('host')}`
  )
}


/*
|--------------------------------------------------------------------------
| GET /api/admin/hot-selling
|--------------------------------------------------------------------------
*/

export const getAdminHotSelling =
  async (
    req,
    res,
    next
  ) => {
    try {

      const [rows] =
        await pool.execute(`
          SELECT
            p.id,
            p.name,
            p.slug,
            p.featured_order,
            p.active,

            c.id AS category_id,
            c.name AS category_name

          FROM products p

          INNER JOIN categories c
            ON c.id = p.category_id

          WHERE p.featured = 1

          ORDER BY
            p.featured_order ASC
        `)


      const products =
        rows.map(
          (row) => ({
            id: row.id,

            name: row.name,

            slug: row.slug,

            featuredOrder:
              row.featured_order,

            active:
              Boolean(
                row.active
              ),

            category: {
              id:
                row.category_id,

              name:
                row.category_name,
            },

            image: {
              url:
                `${getBaseUrl(req)}/api/admin/products/${row.id}/image`,
            },
          })
        )


      res.status(200).json({
        success: true,

        count:
          products.length,

        requiredCount: 8,

        products,
      })

    } catch (error) {
      next(error)
    }
  }


/*
|--------------------------------------------------------------------------
| PUT /api/admin/hot-selling
|--------------------------------------------------------------------------
|
| Body:
|
| {
|   "productIds": [4, 11, 20, 6, 8, 25, 30, 42]
| }
|
*/

export const updateAdminHotSelling =
  async (
    req,
    res,
    next
  ) => {
    let connection


    try {

      const {
        productIds,
      } = req.body


      /*
      |--------------------------------------------------------------------------
      | Must Be Exactly 8
      |--------------------------------------------------------------------------
      */

      if (
        !Array.isArray(
          productIds
        ) ||
        productIds.length !== 8
      ) {
        res.status(400)

        throw new Error(
          'Exactly 8 products must be selected.'
        )
      }


      const ids =
        productIds.map(
          (id) =>
            Number(id)
        )


      if (
        ids.some(
          (id) =>
            !Number.isInteger(id) ||
            id <= 0
        )
      ) {
        res.status(400)

        throw new Error(
          'Invalid product selection.'
        )
      }


      /*
      |--------------------------------------------------------------------------
      | No Duplicate Products
      |--------------------------------------------------------------------------
      */

      if (
        new Set(ids).size !==
        8
      ) {
        res.status(400)

        throw new Error(
          'The same product cannot be selected more than once.'
        )
      }


      connection =
        await pool.getConnection()


      await connection
        .beginTransaction()


      /*
      |--------------------------------------------------------------------------
      | Verify Products Exist + Active
      |--------------------------------------------------------------------------
      */

      const placeholders =
        ids
          .map(() => '?')
          .join(', ')


      const [
        productRows,
      ] =
        await connection.execute(
          `
          SELECT
            id,
            active

          FROM products

          WHERE id IN (
            ${placeholders}
          )

          FOR UPDATE
          `,
          ids
        )


      if (
        productRows.length !==
        8
      ) {
        res.status(400)

        throw new Error(
          'One or more selected products do not exist.'
        )
      }


      const inactiveProduct =
        productRows.find(
          (product) =>
            !Boolean(
              product.active
            )
        )


      if (
        inactiveProduct
      ) {
        res.status(400)

        throw new Error(
          'Only active products can be added to Hot Selling.'
        )
      }


      /*
      |--------------------------------------------------------------------------
      | Remove Old Hot Selling Selection
      |--------------------------------------------------------------------------
      */

      await connection.execute(`
        UPDATE products

        SET
          featured = 0,
          featured_order = NULL

        WHERE
          featured = 1
          OR featured_order IS NOT NULL
      `)


      /*
      |--------------------------------------------------------------------------
      | Save Exactly Eight
      |--------------------------------------------------------------------------
      */

      for (
        let index = 0;
        index < ids.length;
        index += 1
      ) {

        await connection.execute(
          `
          UPDATE products

          SET
            featured = 1,
            featured_order = ?

          WHERE id = ?
          `,
          [
            index + 1,
            ids[index],
          ]
        )

      }


      await connection.commit()


      res.status(200).json({
        success: true,

        message:
          'Hot Selling products updated successfully.',

        count: 8,
      })

    } catch (error) {

      if (connection) {
        await connection
          .rollback()
          .catch(
            () => {}
          )
      }


      next(error)

    } finally {

      if (connection) {
        connection.release()
      }

    }
  }