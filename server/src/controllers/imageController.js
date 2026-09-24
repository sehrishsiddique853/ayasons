import pool from '../config/mysql.js'


const getCategoryImage =
  async (
    req,
    res,
    next,
    type
  ) => {
    try {
      const categoryId =
        Number(req.params.id)


      if (
        !Number.isInteger(categoryId) ||
        categoryId <= 0
      ) {
        res.status(400)

        throw new Error(
          'Invalid category ID'
        )
      }


      const isHero =
        type === 'hero'


      const blobColumn =
        isHero
          ? 'hero_image_blob'
          : 'collection_image_blob'


      const mimeColumn =
        isHero
          ? 'hero_image_mime'
          : 'collection_image_mime'


      const nameColumn =
        isHero
          ? 'hero_image_name'
          : 'collection_image_name'


      const [rows] =
        await pool.query(
          `
          SELECT
            ${blobColumn} AS image_blob,
            ${mimeColumn} AS image_mime,
            ${nameColumn} AS image_name

          FROM categories

          WHERE
            id = ?
            AND active = 1

          LIMIT 1
          `,
          [
            categoryId,
          ]
        )


      if (
        rows.length === 0 ||
        !rows[0].image_blob
      ) {
        res.status(404)

        throw new Error(
          'Category image not found'
        )
      }


      const image =
        rows[0]


      res.set({
        'Content-Type':
          image.image_mime ||
          'application/octet-stream',

        'Content-Length':
          image.image_blob.length,

        'Content-Disposition':
          `inline; filename="${image.image_name || 'image'}"`,

        'Cache-Control':
          'public, max-age=86400',
      })


      res.send(
        image.image_blob
      )

    } catch (error) {
      next(error)
    }
  }


export const getCategoryHeroImage =
  async (
    req,
    res,
    next
  ) => {
    return getCategoryImage(
      req,
      res,
      next,
      'hero'
    )
  }


export const getCategoryCollectionImage =
  async (
    req,
    res,
    next
  ) => {
    return getCategoryImage(
      req,
      res,
      next,
      'collection'
    )
  }

  export const getProductImage =
  async (
    req,
    res,
    next
  ) => {
    try {
      const productId =
        Number(req.params.id)


      if (
        !Number.isInteger(
          productId
        ) ||
        productId <= 0
      ) {
        res.status(400)

        throw new Error(
          'Invalid product ID'
        )
      }


      const [rows] =
        await pool.execute(
          `
          SELECT
            p.image_blob,
            p.image_mime,
            p.image_name

          FROM products p

          INNER JOIN categories c
            ON c.id =
              p.category_id

          WHERE
            p.id = ?
            AND p.active = 1
            AND c.active = 1

          LIMIT 1
          `,
          [
            productId,
          ]
        )


      if (
        rows.length === 0 ||
        !rows[0].image_blob
      ) {
        res.status(404)

        throw new Error(
          'Product image not found'
        )
      }


      const image =
        rows[0]


      res.set({
        'Content-Type':
          image.image_mime ||
          'application/octet-stream',

        'Content-Length':
          image.image_blob.length,

        'Content-Disposition':
          `inline; filename="${image.image_name || 'product-image'}"`,

        'Cache-Control':
          'public, max-age=86400',
      })


      res.send(
        image.image_blob
      )

    } catch (error) {
      next(error)
    }
  }