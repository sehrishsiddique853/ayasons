import pool from '../config/mysql.js'
import { optimizeImage, IMAGE_PRESETS } from '../utils/imageOptimizer.js'
import { readNonNegativeInteger, readText } from '../utils/inputValidation.js'

const slugify = (value = '') =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const parseJson = (value, fallback = []) => {
  if (!value) return fallback
  if (Array.isArray(value) || typeof value === 'object') return value
  try { return JSON.parse(value) } catch { return fallback }
}

const parseBoolean = (value) =>
  value === true || value === 'true' || value === '1' || value === 1

const stableSerialize = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(',')}]`
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) =>
      `${JSON.stringify(key)}:${stableSerialize(value[key])}`
    ).join(',')}}`
  }

  return JSON.stringify(value)
}

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
  colorZones: parseJson(row.color_zones_json, ['Primary Color']),
  optionGroups: parseJson(row.option_groups_json, []),
  specifications: parseJson(row.specifications_json, []),
  defaultOptions: parseJson(row.default_options_json, {}),
  basicOptionSlugs: parseJson(row.basic_option_slugs_json, null),
  requiredFields: parseJson(row.required_fields_json, []),
  defaultColorMode: row.default_color_mode || 'custom',
  presetColors: parseJson(row.preset_colors_json, {}),
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
    sizes_json, colors_json, color_zones_json, option_groups_json, specifications_json,
    default_options_json, basic_option_slugs_json, required_fields_json,
    default_color_mode, preset_colors_json, allow_custom_color,
    allow_logo_upload, allow_player_name, allow_player_number,
    allow_custom_notes, active, display_order, updated_at
  FROM product_customizer_items
`

export const getPublicProductCustomizer = async (req, res, next) => {
  try {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    })

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
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    })

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

const parsePayloadJson = (body, key, expectedType) => {
  let value

  try {
    value = typeof body[key] === 'string'
      ? JSON.parse(body[key])
      : body[key]
  } catch {
    value = null
  }

  const isValid = expectedType === 'array'
    ? Array.isArray(value)
    : Boolean(value) && typeof value === 'object' && !Array.isArray(value)

  if (!isValid) {
    const error = new Error(`Invalid or missing ${key} data. Please review the subproduct form and save again.`)
    error.statusCode = 400
    throw error
  }

  return value
}

const readPayload = (body = {}) => {
  const name = readText(body.name, 'Item name', { maxLength: 150 })
  const rawSlug = readText(body.slug || name, 'Item slug', { maxLength: 180 })
  const slug = slugify(rawSlug)
  if (!slug) {
    const error = new Error('Item slug must include a letter or number.')
    error.statusCode = 400
    throw error
  }

  const defaultColorMode = String(body.defaultColorMode || 'custom').trim()
  if (!['preset', 'custom'].includes(defaultColorMode)) {
    const error = new Error('Color mode must be preset or custom.')
    error.statusCode = 400
    throw error
  }

  return {
    name,
    slug,
    description: readText(body.description ?? '', 'Description', { required: false, maxLength: 20000 }),
    sizes: parsePayloadJson(body, 'sizes', 'array'),
    colors: parsePayloadJson(body, 'colors', 'array'),
    colorZones: parsePayloadJson(body, 'colorZones', 'array'),
    optionGroups: parsePayloadJson(body, 'optionGroups', 'array'),
    specifications: parsePayloadJson(body, 'specifications', 'array'),
    defaultOptions: parsePayloadJson(body, 'defaultOptions', 'object'),
    basicOptionSlugs: parsePayloadJson(body, 'basicOptionSlugs', 'array'),
    requiredFields: parsePayloadJson(body, 'requiredFields', 'array'),
    defaultColorMode,
    presetColors: parsePayloadJson(body, 'presetColors', 'object'),
    allowCustomColor: parseBoolean(body.allowCustomColor),
    allowLogoUpload: parseBoolean(body.allowLogoUpload),
    allowPlayerName: parseBoolean(body.allowPlayerName),
    allowPlayerNumber: parseBoolean(body.allowPlayerNumber),
    allowCustomNotes: parseBoolean(body.allowCustomNotes),
    active: parseBoolean(body.active),
    order: readNonNegativeInteger(body.order, 'Display order'),
  }
}

const validateOptionGroups = (groups, res) => {
  if (!Array.isArray(groups)) {
    res.status(400)
    throw new Error('Customization options must be a valid list.')
  }

  for (const [index, group] of groups.entries()) {
    if (
      !group ||
      typeof group.name !== 'string' ||
      !group.name.trim() ||
      typeof group.slug !== 'string' ||
      !group.slug.trim() ||
      !Array.isArray(group.values) ||
      group.values.length === 0
    ) {
      res.status(400)
      throw new Error(`Customization option ${index + 1} needs a name and at least one choice.`)
    }

    if (
      group.values.length > 100 ||
      group.values.some((value) =>
        typeof value === 'string'
          ? !value.trim() || value.length > 150
          : !value || typeof value !== 'object' ||
            typeof value.label !== 'string' || !value.label.trim() ||
            typeof value.value !== 'string' || !value.value.trim()
      )
    ) {
      res.status(400)
      throw new Error(`Customization option ${index + 1} has an invalid choice.`)
    }
  }
}

const verifyPersistedItem = (item, data) => {
  const fields = [
    'name', 'slug', 'description', 'sizes', 'colors', 'colorZones',
    'optionGroups', 'specifications', 'defaultOptions', 'basicOptionSlugs',
    'requiredFields', 'defaultColorMode', 'presetColors', 'allowCustomColor',
    'allowLogoUpload', 'allowPlayerName', 'allowPlayerNumber', 'allowCustomNotes',
    'active', 'order',
  ]
  const persistedNames = {
    sizes: 'sizes',
    colors: 'colors',
    colorZones: 'colorZones',
    optionGroups: 'optionGroups',
    specifications: 'specifications',
    defaultOptions: 'defaultOptions',
    basicOptionSlugs: 'basicOptionSlugs',
    requiredFields: 'requiredFields',
    defaultColorMode: 'defaultColorMode',
    presetColors: 'presetColors',
    allowCustomColor: 'allowCustomColor',
    allowLogoUpload: 'allowLogoUpload',
    allowPlayerName: 'allowPlayerName',
    allowPlayerNumber: 'allowPlayerNumber',
    allowCustomNotes: 'allowCustomNotes',
    active: 'active',
    order: 'order',
  }
  const matches = fields.every((field) => {
    const persistedField = persistedNames[field] || field
    return stableSerialize(item[persistedField] ?? null) ===
      stableSerialize(data[field] ?? null)
  })

  if (!matches) {
    const error = new Error('The database did not confirm every subproduct field. The item was not reported as saved; retry and check the server connection.')
    error.statusCode = 500
    throw error
  }
}

export const createAdminCustomizerItem = async (req, res, next) => {
  try {
    const productId = Number(req.params.productId)
    const data = readPayload(req.body || {})
    validateOptionGroups(data.optionGroups, res)
    if (!Number.isSafeInteger(productId) || productId <= 0) {
      res.status(400)
      throw new Error('Product and item name are required.')
    }

    let image = null
    if (req.file) image = await optimizeImage(req.file, IMAGE_PRESETS.product)

    const [result] = await pool.execute(
      `
      INSERT INTO product_customizer_items (
        product_id, name, slug, description, image_blob, image_mime, image_name,
        sizes_json, colors_json, color_zones_json, option_groups_json, specifications_json,
        default_options_json, basic_option_slugs_json, required_fields_json,
        default_color_mode, preset_colors_json, allow_custom_color,
        allow_logo_upload, allow_player_name, allow_player_number,
        allow_custom_notes, active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        productId, data.name, data.slug, data.description,
        image?.buffer || null, image?.mimeType || null,
        image ? `${Date.now()}-${image.fileName}` : null,
        JSON.stringify(data.sizes), JSON.stringify(data.colors), JSON.stringify(data.colorZones), JSON.stringify(data.optionGroups), JSON.stringify(data.specifications),
        JSON.stringify(data.defaultOptions), JSON.stringify(data.basicOptionSlugs), JSON.stringify(data.requiredFields),
        data.defaultColorMode, JSON.stringify(data.presetColors),
        data.allowCustomColor ? 1 : 0, data.allowLogoUpload ? 1 : 0,
        data.allowPlayerName ? 1 : 0, data.allowPlayerNumber ? 1 : 0,
        data.allowCustomNotes ? 1 : 0, data.active ? 1 : 0, data.order,
      ]
    )

    const [rows] = await pool.execute(`${baseSelect} WHERE id = ? LIMIT 1`, [result.insertId])
    const item = formatItem(rows[0], true)
    verifyPersistedItem(item, data)
    res.status(201).json({ success: true, item })
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
    const data = readPayload(req.body || {})
    validateOptionGroups(data.optionGroups, res)
    if (!Number.isSafeInteger(productId) || productId <= 0 || !Number.isSafeInteger(itemId) || itemId <= 0) {
      res.status(400)
      throw new Error('Valid product, item and name are required.')
    }

    const fields = [
      'name = ?', 'slug = ?', 'description = ?', 'sizes_json = ?',
      'colors_json = ?', 'color_zones_json = ?', 'option_groups_json = ?', 'specifications_json = ?',
      'default_options_json = ?', 'basic_option_slugs_json = ?', 'required_fields_json = ?',
      'default_color_mode = ?', 'preset_colors_json = ?', 'allow_custom_color = ?',
      'allow_logo_upload = ?', 'allow_player_name = ?', 'allow_player_number = ?',
      'allow_custom_notes = ?', 'active = ?', 'display_order = ?'
    ]
    const params = [
      data.name, data.slug, data.description, JSON.stringify(data.sizes),
      JSON.stringify(data.colors), JSON.stringify(data.colorZones), JSON.stringify(data.optionGroups), JSON.stringify(data.specifications),
      JSON.stringify(data.defaultOptions), JSON.stringify(data.basicOptionSlugs), JSON.stringify(data.requiredFields),
      data.defaultColorMode, JSON.stringify(data.presetColors),
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
      const [existingRows] = await pool.execute(
        'SELECT id FROM product_customizer_items WHERE id = ? AND product_id = ? LIMIT 1',
        [itemId, productId]
      )

      if (!existingRows.length) {
        res.status(404)
        throw new Error('Customizer item not found.')
      }
    }

    const [rows] = await pool.execute(`${baseSelect} WHERE id = ? LIMIT 1`, [itemId])
    const item = formatItem(rows[0], true)
    verifyPersistedItem(item, data)
    res.json({ success: true, item })
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
