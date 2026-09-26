import pool from '../config/mysql.js'


/*
|--------------------------------------------------------------------------
| Send Already-Optimized Image
|--------------------------------------------------------------------------
|
| Images are optimized with Sharp before being stored in MySQL.
|
| No PowerShell.
| No System.Drawing.
| No runtime resizing.
| No temporary files.
|
*/

const sendImageResponse = (
  res,
  {
    imageBlob,
    imageMime,
    imageName,
    fallbackName,
  }
) => {

  if (!imageBlob?.length) {
    res.status(404)

    throw new Error(
      'Image not found'
    )
  }


  const responseMime =
    imageMime ||
    'application/octet-stream'


  const responseName =
    imageName ||
    fallbackName


  res.set({
    'Content-Type':
      responseMime,

    'Content-Length':
      imageBlob.length,

    'Content-Disposition':
      `inline; filename="${
        responseName ||
        fallbackName
      }"`,

   'Cache-Control':
  'public, max-age=604800, immutable',

   
  })


  res.send(
    imageBlob
  )
}


/*
|--------------------------------------------------------------------------
| Category Image
|--------------------------------------------------------------------------
*/

const getCategoryImage = async (
  req,
  res,
  next,
  type
) => {

  try {

    const categoryId =
      Number(
        req.params.id
      )


    if (
      !Number.isInteger(
        categoryId
      ) ||
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
            ${blobColumn}
              AS image_blob,

            ${mimeColumn}
              AS image_mime,

            ${nameColumn}
              AS image_name

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


    sendImageResponse(
      res,
      {
        imageBlob:
          image.image_blob,

        imageMime:
          image.image_mime,

        imageName:
          image.image_name,

        fallbackName:
          `category-${type}-${categoryId}`,
      }
    )

  } catch (error) {

    next(error)

  }
}


/*
|--------------------------------------------------------------------------
| GET Category Hero Image
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| GET Category Collection Image
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| GET Product Image
|--------------------------------------------------------------------------
*/

export const getProductImage =
  async (
    req,
    res,
    next
  ) => {

    try {

      const productId =
        Number(
          req.params.id
        )


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


      sendImageResponse(
        res,
        {
          imageBlob:
            image.image_blob,

          imageMime:
            image.image_mime,

          imageName:
            image.image_name,

          fallbackName:
            `product-${productId}`,
        }
      )

    } catch (error) {

      next(error)

    }
  }