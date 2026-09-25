import 'dotenv/config'

import pool from '../config/mysql.js'


const apiBaseUrl =
  process.env.IMAGE_CACHE_WARM_URL ||
  `http://localhost:${process.env.PORT || 5000}`


const imageWidths =
  [
    520,
    640,
    900,
    1400,
  ]


const requestImage =
  async (url) => {
    const response =
      await fetch(url)


    if (!response.ok) {
      throw new Error(
        `${response.status} ${response.statusText}`
      )
    }


    const contentLength =
      response.headers.get(
        'content-length'
      )


    return Number(
      contentLength || 0
    )
  }


const warmImages =
  async () => {
    const [categoryRows] =
      await pool.query(
        `
        SELECT id
        FROM categories
        WHERE active = 1
        ORDER BY display_order ASC, id ASC
        `
      )


    const [productRows] =
      await pool.query(
        `
        SELECT p.id
        FROM products p
        INNER JOIN categories c
          ON c.id = p.category_id
        WHERE p.active = 1
          AND c.active = 1
        ORDER BY p.featured_order ASC, p.id ASC
        `
      )


    const urls = []


    categoryRows.forEach(
      (category) => {
        imageWidths.forEach(
          (width) => {
            urls.push(
              `${apiBaseUrl}/api/images/categories/${category.id}/hero?w=${width}`
            )


            urls.push(
              `${apiBaseUrl}/api/images/categories/${category.id}/collection?w=${width}`
            )
          }
        )
      }
    )


    productRows.forEach(
      (product) => {
        [
          520,
          900,
        ].forEach(
          (width) => {
            urls.push(
              `${apiBaseUrl}/api/images/products/${product.id}?w=${width}`
            )
          }
        )
      }
    )


    let warmedCount = 0
    let skippedCount = 0


    for (
      const url of urls
    ) {
      try {
        await requestImage(url)
        warmedCount += 1
      } catch (error) {
        skippedCount += 1

        console.warn(
          `Skipped ${url}: ${error.message}`
        )
      }
    }


    console.log(
      `Image cache warm complete. Warmed ${warmedCount} image variants. Skipped ${skippedCount}.`
    )
  }


try {
  await warmImages()
} finally {
  await pool.end()
}
