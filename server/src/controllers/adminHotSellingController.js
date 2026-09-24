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


const formatProduct = (
  row,
  req
) => ({
  id:
    row.id,

  name:
    row.name,

  slug:
    row.slug,

  featuredOrder:
    row.featured_order === null
      ? null
      : Number(
          row.featured_order
        ),

  active:
    Boolean(
      row.active
    ),

  category: {
    id:
      row.category_id,

    name:
      row.category_name,

    slug:
      row.category_slug,
  },

  image: {
    url:
      `${getBaseUrl(req)}/api/admin/products/${row.id}/image`,
  },
})


const productSelect = `
  SELECT
    p.id,
    p.name,
    p.slug,
    p.featured,
    p.featured_order,
    p.active,

    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    c.active AS category_active

  FROM products p

  INNER JOIN categories c
    ON c.id = p.category_id
`


/*
|--------------------------------------------------------------------------
| GET Hot Selling
|--------------------------------------------------------------------------
*/

export const getAdminHotSelling =
  async (
    req,
    res,
    next
  ) => {

    try {

      const [featuredRows] =
        await pool.execute(`
          ${productSelect}

          WHERE
            p.featured = 1

          ORDER BY
            p.featured_order ASC,
            p.id ASC
        `)


      const [availableRows] =
        await pool.execute(`
          ${productSelect}

          WHERE
            p.active = 1
            AND c.active = 1

          ORDER BY
            c.display_order ASC,
            p.display_order ASC,
            p.name ASC
        `)


      res.status(200).json({
        success: true,

        requiredCount: 8,

        count:
          featuredRows.length,

        products:
          featuredRows.map(
            (row) =>
              formatProduct(
                row,
                req
              )
          ),

        availableProducts:
          availableRows.map(
            (row) =>
              formatProduct(
                row,
                req
              )
          ),
      })

    } catch (error) {
      next(error)
    }
  }


/*
|--------------------------------------------------------------------------
| PUT Hot Selling
|--------------------------------------------------------------------------
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


      if (
        new Set(ids).size !==
        8
      ) {

        res.status(400)

        throw new Error(
          'The same product cannot appear in more than one Hot Selling slot.'
        )

      }


      connection =
        await pool.getConnection()


      await connection
        .beginTransaction()


      const placeholders =
        ids
          .map(() => '?')
          .join(', ')


      const [products] =
        await connection.execute(
          `
          SELECT
            p.id,
            p.active,
            c.active AS category_active

          FROM products p

          INNER JOIN categories c
            ON c.id = p.category_id

          WHERE
            p.id IN (
              ${placeholders}
            )

          FOR UPDATE
          `,
          ids
        )


      if (
        products.length !== 8
      ) {

        res.status(400)

        throw new Error(
          'One or more selected products do not exist.'
        )

      }


      const unavailable =
        products.find(
          (product) =>
            !Boolean(
              product.active
            ) ||
            !Boolean(
              product.category_active
            )
        )


      if (unavailable) {

        res.status(400)

        throw new Error(
          'Only products visible on the website can be selected.'
        )

      }


      /*
      |--------------------------------------------------------------------------
      | Clear old Hot Selling
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
      | Save Slots 1 - 8
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

        count: 8,

        message:
          'Hot Selling products updated successfully.',
      })

    } catch (error) {

      if (connection) {

        await connection
          .rollback()
          .catch(() => {})

      }


      next(error)

    } finally {

      if (connection) {
        connection.release()
      }

    }
  }