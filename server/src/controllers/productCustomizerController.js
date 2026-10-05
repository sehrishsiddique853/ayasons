import pool from '../config/mysql.js'
import { optimizeImage, IMAGE_PRESETS } from '../utils/imageOptimizer.js'

const slugify = (value = '') =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const parseJson = (value, fallback = []) => {
  if (!value) return fallback
  if (Array.isArray(value) || typeof value === 'object') return value
  try { return JSON.parse(value) } catch { return fallback }
}

const parseBoolean = (value) =>
  value === true || value === 'true' || value === '1' || value === 1

const formatItem = (row, admin = false) => ({
  id: row.id,
  productId: row.product_id,
  name: row.name,
  slug: row.slug,
  description: row.description || '',
  image: {
    url: `/api/images/customizer/${row.id}?v=${encodeURIComponent(row.image_name || row.updated_at || '1')}`,
  },
  sizes: parseJson(row.sizes_json, []),
  colors: parseJson(row.colors_json, []),
  optionGroups: parseJson(row.option_groups_json, []),
  allowCustomColor: Boolean(row.allow_custom_color),
  allowLogoUpload: Boolean(row.allow_logo_upload),
  allowPlayerName: Boolean(row.allow_player_name),
  allowPlayerNumber: Boolean(row.allow_player_number),
  allowCustomNotes: Boolean(row.allow_custom_notes),
  active: Boolean(row.active),
  order: Number(row.display_order || 0),
})

const baseSelect = `
  SELECT id, product_id, name, slug, description, image_name,
    sizes_json, colors_json, option_groups_json, allow_custom_color,
    allow_logo_upload, allow_player_name, allow_player_number,
    allow_custom_notes, active, display_order, updated_at
  FROM product_customizer_items
`

export const getPublicProductCustomizer = async (req, res, next) => {
  try {
    const { categorySlug, productSlug } = req.params
    const [products] = await pool.execute(
      `
      SELECT p.id, p.name, p.slug, p.description, p.image_name,
        c.name AS category_name, c.slug AS category_slug
      FROM products p
      INNER JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ? AND c.slug = ? AND p.active = 1 AND c.active = 1
      LIMIT 1
      `,
      [productSlug.toLowerCase(), categorySlug.toLowerCase()]
    )

    if (!products.length) {
      res.status(404)
      throw new Error('Product not found.')
    }

    const product = products[0]
    const [rows] = await pool.execute(
      `${baseSelect} WHERE product_id = ? AND active = 1 ORDER BY display_order ASC, id ASC`,
      [product.id]
    )

    if (!rows.length) {
      res.status(404)
      throw new Error('Product customizer not available.')
    }

    const fallbackImage = `/api/images/products/${product.id}?v=${encodeURIComponent(product.image_name || '1')}`

    res.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        category: { name: product.category_name, slug: product.category_slug },
        items: rows.map((row) => {
          const item = formatItem(row)
          if (!row.image_name) item.image.url = fallbackImage
          return item
        }),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getAdminProductCustomizer = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId)
    const [rows] = await pool.execute(
      `${baseSelect} WHERE product_id = ? ORDER BY display_order ASC, id ASC`,
      [productId]
    )
    res.json({ success: true, items: rows.map((row) => formatItem(row, true)) })
  } catch (error) {
    next(error)
  }
}

const readPayload = (body) => ({
  name: body.name?.trim(),
  slug: slugify(body.slug || body.name || ''),
  description: body.description?.trim() || '',
  sizes: parseJson(body.sizes, []),
  colors: parseJson(body.colors, []),
  optionGroups: parseJson(body.optionGroups, []),
  allowCustomColor: parseBoolean(body.allowCustomColor),
  allowLogoUpload: parseBoolean(body.allowLogoUpload),
  allowPlayerName: parseBoolean(body.allowPlayerName),
  allowPlayerNumber: parseBoolean(body.allowPlayerNumber),
  allowCustomNotes: parseBoolean(body.allowCustomNotes ?? true),
  active: parseBoolean(body.active ?? true),
  order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
})

export const createAdminCustomizerItem = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId)
    const data = readPayload(req.body)
    if (!productId || !data.name || !data.slug) {
      res.status(400)
      throw new Error('Product and item name are required.')
    }

    let image = null
    if (req.file) image = await optimizeImage(req.file, IMAGE_PRESETS.product)

    const [result] = await pool.execute(
      `
      INSERT INTO product_customizer_items (
        product_id, name, slug, description, image_blob, image_mime, image_name,
        sizes_json, colors_json, option_groups_json, allow_custom_color,
        allow_logo_upload, allow_player_name, allow_player_number,
        allow_custom_notes, active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        productId, data.name, data.slug, data.description,
        image?.buffer || null, image?.mimeType || null,
        image ? `${Date.now()}-${image.fileName}` : null,
        JSON.stringify(data.sizes), JSON.stringify(data.colors), JSON.stringify(data.optionGroups),
        data.allowCustomColor ? 1 : 0, data.allowLogoUpload ? 1 : 0,
        data.allowPlayerName ? 1 : 0, data.allowPlayerNumber ? 1 : 0,
        data.allowCustomNotes ? 1 : 0, data.active ? 1 : 0, data.order,
      ]
    )

    const [rows] = await pool.execute(`${baseSelect} WHERE id = ? LIMIT 1`, [result.insertId])
    res.status(201).json({ success: true, item: formatItem(rows[0], true) })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409)
      return next(new Error('A customizer item with this slug already exists.'))
    }
    next(error)
  }
}

export const updateAdminCustomizerItem = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId)
    const itemId = Number(req.params.itemId)
    const data = readPayload(req.body)
    if (!productId || !itemId || !data.name || !data.slug) {
      res.status(400)
      throw new Error('Valid product, item and name are required.')
    }

    const fields = [
      'name = ?', 'slug = ?', 'description = ?', 'sizes_json = ?',
      'colors_json = ?', 'option_groups_json = ?', 'allow_custom_color = ?',
      'allow_logo_upload = ?', 'allow_player_name = ?', 'allow_player_number = ?',
      'allow_custom_notes = ?', 'active = ?', 'display_order = ?'
    ]
    const params = [
      data.name, data.slug, data.description, JSON.stringify(data.sizes),
      JSON.stringify(data.colors), JSON.stringify(data.optionGroups),
      data.allowCustomColor ? 1 : 0, data.allowLogoUpload ? 1 : 0,
      data.allowPlayerName ? 1 : 0, data.allowPlayerNumber ? 1 : 0,
      data.allowCustomNotes ? 1 : 0, data.active ? 1 : 0, data.order
    ]

    if (req.file) {
      const image = await optimizeImage(req.file, IMAGE_PRESETS.product)
      fields.push('image_blob = ?', 'image_mime = ?', 'image_name = ?')
      params.push(image.buffer, image.mimeType, `${Date.now()}-${image.fileName}`)
    }

    params.push(itemId, productId)
    const [result] = await pool.execute(
      `UPDATE product_customizer_items SET ${fields.join(', ')} WHERE id = ? AND product_id = ?`,
      params
    )

    if (!result.affectedRows) {
      res.status(404)
      throw new Error('Customizer item not found.')
    }

    const [rows] = await pool.execute(`${baseSelect} WHERE id = ? LIMIT 1`, [itemId])
    res.json({ success: true, item: formatItem(rows[0], true) })
  } catch (error) {
    next(error)
  }
}

export const deleteAdminCustomizerItem = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId)
    const itemId = Number(req.params.itemId)
    const [result] = await pool.execute(
      'DELETE FROM product_customizer_items WHERE id = ? AND product_id = ?',
      [itemId, productId]
    )
    if (!result.affectedRows) {
      res.status(404)
      throw new Error('Customizer item not found.')
    }
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}
