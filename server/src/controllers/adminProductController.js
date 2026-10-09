import pool from '../config/mysql.js'

import {
  optimizeImage,
  IMAGE_PRESETS,
} from '../utils/imageOptimizer.js'
import {
  readArray,
  readBoolean,
  readNonNegativeInteger,
  readText,
} from '../utils/inputValidation.js'

const getBaseUrl = (req) => {
  const configured = process.env.SERVER_URL?.trim()?.replace(/\/+$/, '')
  return configured || `${req.protocol}://${req.get('host')}`
}

const normalizeSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const parseJson = (value, fallback = []) => {
  if (!value) {
    return fallback
  }

  if (Array.isArray(value) || typeof value === 'object') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const parseArray = (value, label) => {
  const parsed = readArray(value ?? '[]', label)

  if (parsed.length > 300 || parsed.some((entry) => typeof entry !== 'string' || entry.trim().length > 300)) {
    const error = new Error(`${label} must contain no more than 300 text values.`)
    error.statusCode = 400
    throw error
  }

  return parsed.map((entry) => entry.trim()).filter(Boolean)
}

const parseBoolean = (value) =>
  value === true ||
  value === 'true' ||
  value === '1' ||
  value === 1

const versionImageName = (fileName) =>
  `${Date.now()}-${fileName}`

const formatProduct = (row, req) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  categoryId: row.category_id,
  category: {
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug,
  },
  group: row.group_name || '',
  description: row.description || '',
  features: parseJson(row.features_json, []),
  featured: Boolean(row.featured),
  featuredOrder:
    row.featured_order === null
      ? null
      : Number(row.featured_order),
  active: Boolean(row.active),
  order: row.display_order,
  image: {
    url: `${getBaseUrl(req)}/api/admin/products/${row.id}/image`,
  },
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const selectProductSql = `
  SELECT
    p.id,
    p.category_id,
    p.name,
    p.slug,
    p.group_name,
    p.description,
    p.features_json,
    p.featured,
    p.featured_order,
    p.active,
    p.display_order,
    p.created_at,
    p.updated_at,
    c.name AS category_name,
    c.slug AS category_slug
  FROM products p
  INNER JOIN categories c
    ON c.id = p.category_id
`

const getProductById = async (id, req) => {
  const [rows] = await pool.execute(
    `${selectProductSql}
     WHERE p.id = ?
     LIMIT 1`,
    [id]
  )

  return rows[0] ? formatProduct(rows[0], req) : null
}

const updateHotSellingSlot = async (
  connection,
  productId,
  featured,
  featuredOrder
) => {
  const shouldFeature = parseBoolean(featured)

  if (!shouldFeature) {
    const [currentRows] = await connection.execute(
      `
      SELECT featured
      FROM products
      WHERE id = ?
      LIMIT 1
      `,
      [productId]
    )

    if (Boolean(currentRows[0]?.featured)) {
      const [countRows] = await connection.execute(`
        SELECT COUNT(*) AS total
        FROM products
        WHERE featured = 1
      `)

      if (Number(countRows[0].total) <= 8) {
        const error = new Error(
          'Hot Selling must have exactly 8 products. Replace this product with another product instead of removing it.'
        )
        error.statusCode = 400
        throw error
      }
    }

    await connection.execute(
      `
      UPDATE products
      SET
        featured = 0,
        featured_order = NULL
      WHERE id = ?
      `,
      [productId]
    )

    return
  }

  const slot = Number(featuredOrder)

  if (
    !Number.isInteger(slot) ||
    slot < 1 ||
    slot > 8
  ) {
    const error = new Error('Choose a Hot Selling slot from 1 to 8.')
    error.statusCode = 400
    throw error
  }

  const [visibilityRows] = await connection.execute(
    `
    SELECT
      p.active,
      c.active AS category_active
    FROM products p
    INNER JOIN categories c
      ON c.id = p.category_id
    WHERE p.id = ?
    LIMIT 1
    `,
    [productId]
  )

  if (
    !Boolean(visibilityRows[0]?.active) ||
    !Boolean(visibilityRows[0]?.category_active)
  ) {
    const error = new Error(
      'Only products visible on the website can be selected for Hot Selling.'
    )
    error.statusCode = 400
    throw error
  }

  await connection.execute(
    `
    UPDATE products
    SET
      featured = 0,
      featured_order = NULL
    WHERE
      featured_order = ?
      AND id <> ?
    `,
    [slot, productId]
  )

  await connection.execute(
    `
    UPDATE products
    SET
      featured = 1,
      featured_order = ?
    WHERE id = ?
    `,
    [slot, productId]
  )
}

export const getAdminProducts = async (req, res, next) => {
  try {
    const categoryId = Number(req.query.categoryId || 0)
    const params = []
    let where = ''

    if (Number.isInteger(categoryId) && categoryId > 0) {
      where = 'WHERE p.category_id = ?'
      params.push(categoryId)
    }

    const [rows] = await pool.execute(
      `
      ${selectProductSql}
      ${where}
      ORDER BY
        c.display_order ASC,
        p.display_order ASC,
        p.created_at ASC
      `,
      params
    )

    const products = rows.map((row) => formatProduct(row, req))

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    })
  } catch (error) {
    next(error)
  }
}

export const getAdminProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400)
      throw new Error('Invalid product ID.')
    }

    const product = await getProductById(id, req)

    if (!product) {
      res.status(404)
      throw new Error('Product not found.')
    }

    res.status(200).json({
      success: true,
      product,
    })
  } catch (error) {
    next(error)
  }
}

export const getAdminProductImage = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400)
      throw new Error('Invalid product ID.')
    }

    const [rows] = await pool.execute(
      `
      SELECT
        image_blob,
        image_mime,
        image_name
      FROM products
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    )

    if (rows.length === 0 || !rows[0].image_blob) {
      res.status(404)
      throw new Error('Product image not found.')
    }

    const image = rows[0]

    res.set({
      'Content-Type': image.image_mime || 'application/octet-stream',
      'Content-Length': image.image_blob.length,
      'Content-Disposition': `inline; filename="${image.image_name || 'product-image'}"`,
      'Cache-Control': 'no-store',
    })

    res.send(image.image_blob)
  } catch (error) {
    next(error)
  }
}

export const createAdminProduct = async (req, res, next) => {
  let connection

  try {
    const body = req.body || {}
    const {
      categoryId,
      name,
      slug,
      group = '',
      description,
      features = '[]',
      featured = 'false',
      featuredOrder = '',
      active = 'true',
      order = 0,
    } = body

    const parsedCategoryId = Number(categoryId)

    if (!Number.isSafeInteger(parsedCategoryId) || parsedCategoryId <= 0) {
      res.status(400)
      throw new Error('Category, name, slug and description are required.')
    }

    const safeName = readText(name, 'Name', { maxLength: 150 })
    const safeSlug = readText(slug, 'Slug', { maxLength: 180 })
    const safeGroup = readText(group, 'Group', { required: false, maxLength: 150 })
    const safeDescription = readText(description, 'Description', { maxLength: 20000 })
    const safeFeatured = readBoolean(featured, 'Featured status', false)
    const safeActive = readBoolean(active, 'Active status', true)
    const displayOrder = readNonNegativeInteger(order, 'Display order')

    if (!req.file) {
  res.status(400)
  throw new Error(
    'Product image is required.'
  )
}


/*
|--------------------------------------------------------------------------
| Optimize Product Image Before MySQL
|--------------------------------------------------------------------------
*/

const optimizedImage =
  await optimizeImage(
    req.file,
    IMAGE_PRESETS.product
  )


console.log(
  `Product image optimized: ${
    (
      optimizedImage.originalSize /
      1024
    ).toFixed(2)
  } KB → ${
    (
      optimizedImage.optimizedSize /
      1024
    ).toFixed(2)
  } KB`
)


const normalizedSlug =
  normalizeSlug(safeSlug)

if (!normalizedSlug) {
  const error = new Error('Slug must include at least one letter or number.')
  error.statusCode = 400
  throw error
}


const parsedFeatures =
  parseArray(
    features,
    'Features'
  )


connection =
  await pool.getConnection()
    await connection.beginTransaction()

    const [result] = await connection.execute(
      `
      INSERT INTO products (
        category_id,
        name,
        slug,
        group_name,
        description,
        image,
        image_blob,
        image_mime,
        image_name,
        features_json,
        featured,
        featured_order,
        active,
        display_order
      )
      VALUES (?, ?, ?, ?, ?, '', ?, ?, ?, ?, ?, NULL, ?, ?)
      `,
      [
        parsedCategoryId,
        safeName,
        normalizedSlug,
        safeGroup,
        safeDescription,
        optimizedImage.buffer,
optimizedImage.mimeType,
versionImageName(optimizedImage.fileName),
        JSON.stringify(parsedFeatures),
        safeFeatured ? 1 : 0,
        safeActive ? 1 : 0,
        displayOrder,
      ]
    )

    await updateHotSellingSlot(
      connection,
      result.insertId,
      safeFeatured,
      featuredOrder
    )

    await connection.commit()

    const product = await getProductById(result.insertId, req)

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    })
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {})
    }

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409)
      return next(new Error('A product with this slug already exists in this category.'))
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400)
      return next(new Error('Selected category does not exist.'))
    }

    if (error.statusCode) {
      res.status(error.statusCode)
    }

    next(error)
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export const updateAdminProduct = async (req, res, next) => {
  let connection

  try {
    const id = Number(req.params.id)
    const body = req.body || {}
    const {
      categoryId,
      name,
      slug,
      group = '',
      description,
      features = '[]',
      featured = 'false',
      featuredOrder = '',
      active = 'true',
      order = 0,
    } = body

    const parsedCategoryId = Number(categoryId)

    if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(parsedCategoryId) || parsedCategoryId <= 0) {
      res.status(400)
      throw new Error('Valid product ID, category, name, slug and description are required.')
    }

    const safeName = readText(name, 'Name', { maxLength: 150 })
    const safeSlug = readText(slug, 'Slug', { maxLength: 180 })
    const safeGroup = readText(group, 'Group', { required: false, maxLength: 150 })
    const safeDescription = readText(description, 'Description', { maxLength: 20000 })
    const safeFeatured = readBoolean(featured, 'Featured status', false)
    const safeActive = readBoolean(active, 'Active status', true)
    const displayOrder = readNonNegativeInteger(order, 'Display order')

const normalizedSlug =
  normalizeSlug(safeSlug)

if (!normalizedSlug) {
  const error = new Error('Slug must include at least one letter or number.')
  error.statusCode = 400
  throw error
}


const parsedFeatures =
  parseArray(
    features,
    'Features'
  )


/*
|--------------------------------------------------------------------------
| Optimize New Product Image
|--------------------------------------------------------------------------
|
| Only runs if admin selected
| a replacement image.
|
*/

let optimizedImage = null


if (req.file) {

  optimizedImage =
    await optimizeImage(
      req.file,
      IMAGE_PRESETS.product
    )


  console.log(
    `Product image optimized: ${
      (
        optimizedImage.originalSize /
        1024
      ).toFixed(2)
    } KB → ${
      (
        optimizedImage.optimizedSize /
        1024
      ).toFixed(2)
    } KB`
  )

}


const fields = [
      'category_id = ?',
      'name = ?',
      'slug = ?',
      'group_name = ?',
      'description = ?',
      'features_json = ?',
      'featured = ?',
      'active = ?',
      'display_order = ?',
    ]

    const params = [
      parsedCategoryId,
      safeName,
      normalizedSlug,
      safeGroup,
      safeDescription,
      JSON.stringify(parsedFeatures),
      safeFeatured ? 1 : 0,
      safeActive ? 1 : 0,
      displayOrder,
    ]

    if (optimizedImage) {

  fields.push(
    'image_blob = ?',
    'image_mime = ?',
    'image_name = ?'
  )


  params.push(
    optimizedImage.buffer,
    optimizedImage.mimeType,
    versionImageName(optimizedImage.fileName)
  )

}

    params.push(id)

    connection = await pool.getConnection()
    await connection.beginTransaction()

    const [result] = await connection.execute(
      `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = ?
      `,
      params
    )

    if (result.affectedRows === 0) {
      res.status(404)
      throw new Error('Product not found.')
    }

    await updateHotSellingSlot(
      connection,
      id,
      safeFeatured,
      featuredOrder
    )

    await connection.commit()

    const product = await getProductById(id, req)

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    })
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {})
    }

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409)
      return next(new Error('A product with this slug already exists in this category.'))
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400)
      return next(new Error('Selected category does not exist.'))
    }

    if (error.statusCode) {
      res.status(error.statusCode)
    }

    next(error)
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export const deleteAdminProduct = async (req, res, next) => {
  let connection

  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400)
      throw new Error('Invalid product ID.')
    }

    connection = await pool.getConnection()
    await connection.beginTransaction()

    const [productRows] = await connection.execute(
      `
      SELECT featured
      FROM products
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    )

    if (productRows.length === 0) {
      res.status(404)
      throw new Error('Product not found.')
    }

    if (Boolean(productRows[0].featured)) {
      const [countRows] = await connection.execute(`
        SELECT COUNT(*) AS total
        FROM products
        WHERE featured = 1
      `)

      if (Number(countRows[0].total) <= 8) {
        res.status(400)
        throw new Error(
          'Hot Selling must have exactly 8 products. Replace this product before deleting it.'
        )
      }
    }

    const [result] = await connection.execute(
      `
      DELETE FROM products
      WHERE id = ?
      `,
      [id]
    )

    if (result.affectedRows === 0) {
      res.status(404)
      throw new Error('Product not found.')
    }

    await connection.commit()

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    })
  } catch (error) {
    if (connection) {
      await connection.rollback().catch(() => {})
    }

    next(error)
  } finally {
    if (connection) {
      connection.release()
    }
  }
}
