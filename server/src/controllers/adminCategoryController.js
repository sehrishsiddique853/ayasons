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
  const configured = process.env.SERVER_URL
    ?.trim()
    ?.replace(/\/+$/, '')

  return (
    configured ||
    `${req.protocol}://${req.get('host')}`
  )
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

  if (
    Array.isArray(value) ||
    typeof value === 'object'
  ) {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const parseGroups = (value) => {
  const groups = readArray(value ?? '[]', 'Groups')

  if (groups.length > 100) {
    const error = new Error('Groups cannot contain more than 100 entries.')
    error.statusCode = 400
    throw error
  }

  return groups.map((group, index) => {
    if (!group || typeof group !== 'object' || Array.isArray(group)) {
      const error = new Error(`Group ${index + 1} must be an object.`)
      error.statusCode = 400
      throw error
    }

    const title = readText(group.title, `Group ${index + 1} title`, { maxLength: 150 })
    const items = readArray(group.items, `Group ${index + 1} items`)
    if (items.length > 300 || items.some((item) => typeof item !== 'string' || item.trim().length > 150)) {
      const error = new Error(`Group ${index + 1} has invalid items.`)
      error.statusCode = 400
      throw error
    }

    return { title, items: items.map((item) => item.trim()) }
  })
}

const formatCategory = (row, req) => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  eyebrow: row.eyebrow || '',
  showcaseLabel: row.showcase_label || '',
  heroTitle: row.hero_title || '',
  description: row.description || '',
  collectionDescription:
    row.collection_description || '',
  groups: parseJson(row.groups_json, []),
  productCount: Number(row.product_count || 0),
  active: Boolean(row.active),
  order: row.display_order,

  image: {
    url: `${getBaseUrl(
      req
    )}/api/admin/categories/${
      row.id
    }/image?type=collection`,
  },

  heroImage: {
    url: `${getBaseUrl(
      req
    )}/api/admin/categories/${
      row.id
    }/image?type=hero`,
  },

  collectionImage: {
    url: `${getBaseUrl(
      req
    )}/api/admin/categories/${
      row.id
    }/image?type=collection`,
  },

  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const selectCategorySql = `
  SELECT
    c.id,
    c.name,
    c.slug,
    c.eyebrow,
    c.showcase_label,
    c.hero_title,
    c.description,
    c.collection_description,
    c.groups_json,
    c.active,
    c.display_order,
    c.created_at,
    c.updated_at,
    (
      SELECT COUNT(*)
      FROM products p
      WHERE p.category_id = c.id
    ) AS product_count
  FROM categories c
`

const getCategoryById = async (id, req) => {
  const [rows] = await pool.execute(
    `${selectCategorySql}
     WHERE c.id = ?
     LIMIT 1`,
    [id]
  )

  return rows[0]
    ? formatCategory(rows[0], req)
    : null
}

export const getAdminCategories = async (
  req,
  res,
  next
) => {
  try {
    const [rows] = await pool.execute(`
      ${selectCategorySql}
      ORDER BY
        c.display_order ASC,
        c.created_at ASC
    `)

    const categories = rows.map((row) =>
      formatCategory(row, req)
    )

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

export const getAdminCategory = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400)
      throw new Error('Invalid category ID.')
    }

    const category = await getCategoryById(
      id,
      req
    )

    if (!category) {
      res.status(404)
      throw new Error('Category not found.')
    }

    res.status(200).json({
      success: true,
      category,
    })
  } catch (error) {
    next(error)
  }
}

export const getAdminCategoryImage = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id)

    const type =
      req.query.type === 'hero'
        ? 'hero'
        : 'collection'

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400)
      throw new Error('Invalid category ID.')
    }

    const prefix =
      type === 'hero'
        ? 'hero'
        : 'collection'

    const [rows] = await pool.execute(
      `
        SELECT
          ${prefix}_image_blob AS image_blob,
          ${prefix}_image_mime AS image_mime,
          ${prefix}_image_name AS image_name
        FROM categories
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    if (
      rows.length === 0 ||
      !rows[0].image_blob
    ) {
      res.status(404)

      throw new Error(
        'Category image not found.'
      )
    }

    const image = rows[0]

    res.set({
      'Content-Type':
        image.image_mime ||
        'application/octet-stream',

      'Content-Length':
        image.image_blob.length,

      'Content-Disposition':
        `inline; filename="${
          image.image_name ||
          'category-image'
        }"`,

      'Cache-Control': 'no-store',
    })

    res.send(image.image_blob)
  } catch (error) {
    next(error)
  }
}

export const createAdminCategory = async (
  req,
  res,
  next
) => {
  let connection

  try {
    const body = req.body || {}
    const {
      name,
      slug,
      eyebrow = '',
      showcaseLabel = '',
      heroTitle,
      description,
      collectionDescription = '',
      groups = '[]',
      order = 0,
      active = 'true',
    } = body

    const safeName = readText(name, 'Name', { maxLength: 100 })
    const safeSlug = readText(slug, 'Slug', { maxLength: 120 })
    const safeHeroTitle = readText(heroTitle, 'Hero title', { maxLength: 180 })
    const safeDescription = readText(description, 'Description', { maxLength: 20000 })
    const safeEyebrow = readText(eyebrow, 'Eyebrow', { required: false, maxLength: 100 })
    const safeShowcaseLabel = readText(showcaseLabel, 'Showcase label', { required: false, maxLength: 100 })
    const safeCollectionDescription = readText(collectionDescription, 'Collection description', { required: false, maxLength: 20000 })

    const normalizedSlug =
      normalizeSlug(safeSlug)

    if (!normalizedSlug) {
      res.status(400)

      throw new Error(
        'Invalid category slug.'
      )
    }

    const heroImage =
      req.files?.heroImage?.[0]

    const collectionImage =
      req.files?.collectionImage?.[0]

    if (!heroImage || !collectionImage) {
      res.status(400)

      throw new Error(
        'Hero image and collection image are required.'
      )
    }

    // Optimize both category images before
    // storing them in MySQL.
    const [
      optimizedHeroImage,
      optimizedCollectionImage,
    ] = await Promise.all([
      optimizeImage(
        heroImage,
        IMAGE_PRESETS.categoryHero
      ),

      optimizeImage(
        collectionImage,
        IMAGE_PRESETS.categoryCollection
      ),
    ])

    const parsedGroups =
      parseGroups(groups)

    const displayOrder = readNonNegativeInteger(order, 'Display order')
    const isActive = readBoolean(active, 'Active status', true)

    connection =
      await pool.getConnection()

    await connection.beginTransaction()

    const [result] =
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
            hero_image_blob,
            hero_image_mime,
            hero_image_name,
            collection_image,
            collection_image_blob,
            collection_image_mime,
            collection_image_name,
            groups_json,
            active,
            display_order
          )
          VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            '', ?, ?, ?,
            '', ?, ?, ?,
            ?, ?, ?
          )
        `,
        [
          safeName,
          normalizedSlug,
          safeEyebrow,
          safeShowcaseLabel,
          safeHeroTitle,
          safeDescription,
          safeCollectionDescription,

          optimizedHeroImage.buffer,
          optimizedHeroImage.mimeType,
          optimizedHeroImage.fileName,

          optimizedCollectionImage.buffer,
          optimizedCollectionImage.mimeType,
          optimizedCollectionImage.fileName,

          JSON.stringify(parsedGroups),
          isActive ? 1 : 0,
          displayOrder,
        ]
      )

    await connection.commit()

    const category =
      await getCategoryById(
        result.insertId,
        req
      )

    res.status(201).json({
      success: true,
      message:
        'Category created successfully.',
      category,
    })
  } catch (error) {
    if (connection) {
      await connection
        .rollback()
        .catch(() => {})
    }

    if (
      error.code === 'ER_DUP_ENTRY'
    ) {
      res.status(409)

      return next(
        new Error(
          'A category with this slug already exists.'
        )
      )
    }

    next(error)
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

export const updateAdminCategory = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400)

      throw new Error(
        'Invalid category ID.'
      )
    }

    const body = req.body || {}
    const {
      name,
      slug,
      eyebrow = '',
      showcaseLabel = '',
      heroTitle,
      description,
      collectionDescription = '',
      groups = '[]',
      order = 0,
      active = 'true',
    } = body

    const safeName = readText(name, 'Name', { maxLength: 100 })
    const safeSlug = readText(slug, 'Slug', { maxLength: 120 })
    const safeHeroTitle = readText(heroTitle, 'Hero title', { maxLength: 180 })
    const safeDescription = readText(description, 'Description', { maxLength: 20000 })
    const safeEyebrow = readText(eyebrow, 'Eyebrow', { required: false, maxLength: 100 })
    const safeShowcaseLabel = readText(showcaseLabel, 'Showcase label', { required: false, maxLength: 100 })
    const safeCollectionDescription = readText(collectionDescription, 'Collection description', { required: false, maxLength: 20000 })

    const normalizedSlug =
      normalizeSlug(safeSlug)

    if (!normalizedSlug) {
      const error = new Error('Slug must include at least one letter or number.')
      error.statusCode = 400
      throw error
    }

    const parsedGroups =
      parseGroups(groups)

    const displayOrder = readNonNegativeInteger(order, 'Display order')
    const isActive = readBoolean(active, 'Active status', true)

    const heroImage =
      req.files?.heroImage?.[0]

    const collectionImage =
      req.files?.collectionImage?.[0]

    let optimizedHeroImage = null
    let optimizedCollectionImage = null

    // Only optimize images that were
    // actually supplied during the update.
    if (heroImage) {
      optimizedHeroImage =
        await optimizeImage(
          heroImage,
          IMAGE_PRESETS.categoryHero
        )
    }

    if (collectionImage) {
      optimizedCollectionImage =
        await optimizeImage(
          collectionImage,
          IMAGE_PRESETS.categoryCollection
        )
    }

    const fields = [
      'name = ?',
      'slug = ?',
      'eyebrow = ?',
      'showcase_label = ?',
      'hero_title = ?',
      'description = ?',
      'collection_description = ?',
      'groups_json = ?',
      'active = ?',
      'display_order = ?',
    ]

    const params = [
      safeName,
      normalizedSlug,
      safeEyebrow,
      safeShowcaseLabel,
      safeHeroTitle,
      safeDescription,
      safeCollectionDescription,
      JSON.stringify(parsedGroups),
      isActive ? 1 : 0,
      displayOrder,
    ]

    if (optimizedHeroImage) {
      fields.push(
        'hero_image_blob = ?',
        'hero_image_mime = ?',
        'hero_image_name = ?'
      )

      params.push(
        optimizedHeroImage.buffer,
        optimizedHeroImage.mimeType,
        optimizedHeroImage.fileName
      )
    }

    if (optimizedCollectionImage) {
      fields.push(
        'collection_image_blob = ?',
        'collection_image_mime = ?',
        'collection_image_name = ?'
      )

      params.push(
        optimizedCollectionImage.buffer,
        optimizedCollectionImage.mimeType,
        optimizedCollectionImage.fileName
      )
    }

    params.push(id)

    const [result] =
      await pool.execute(
        `
          UPDATE categories
          SET ${fields.join(', ')}
          WHERE id = ?
        `,
        params
      )

    if (
      result.affectedRows === 0
    ) {
      res.status(404)

      throw new Error(
        'Category not found.'
      )
    }

    const category =
      await getCategoryById(
        id,
        req
      )

    res.status(200).json({
      success: true,
      message:
        'Category updated successfully.',
      category,
    })
  } catch (error) {
    if (
      error.code === 'ER_DUP_ENTRY'
    ) {
      res.status(409)

      return next(
        new Error(
          'A category with this slug already exists.'
        )
      )
    }

    next(error)
  }
}

export const deleteAdminCategory = async (
  req,
  res,
  next
) => {
  try {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400)

      throw new Error(
        'Invalid category ID.'
      )
    }

    const [result] =
      await pool.execute(
        `
          DELETE FROM categories
          WHERE id = ?
        `,
        [id]
      )

    if (
      result.affectedRows === 0
    ) {
      res.status(404)

      throw new Error(
        'Category not found.'
      )
    }

    res.status(200).json({
      success: true,
      message:
        'Category deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}
