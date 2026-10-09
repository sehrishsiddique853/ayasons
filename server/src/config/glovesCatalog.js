import pool from '../config/mysql.js'

/**
 * Non-destructive catalog migration. Idempotent and safe on restarts:
 * - creates the dedicated Gloves category when absent
 * - moves matching glove products from other categories while preserving images
 * - creates missing glove products
 * - removes obsolete glove labels from Accessories groups, not its other items
 *
 * Category/product images remain admin-managed and are never overwritten.
 */
const gloves = [
  {
    name: 'Safety Gloves',
    slug: 'safety-gloves',
    description: 'Protective work gloves designed for secure grip, durability and branded safety equipment.',
    features: ['Grip Options', 'Durable Materials', 'Custom Sizes'],
  },
  {
    name: 'Goalkeeper Gloves',
    slug: 'goalkeeper-gloves',
    description: 'Performance goalkeeper gloves with customizable palm grip, backhand materials and fit.',
    features: ['Grip Latex Options', 'Custom Branding', 'Custom Sizes'],
  },
  {
    name: 'Golf Gloves',
    slug: 'golf-gloves',
    description: 'Comfortable golf gloves for reliable grip, flexibility and private-label branding.',
    features: ['Material Options', 'Custom Branding', 'Custom Sizes'],
  },
]

export const ensureGlovesCategory = async () => {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    await connection.execute(
      `INSERT IGNORE INTO categories (
        name, slug, eyebrow, showcase_label, hero_title,
        description, collection_description, hero_image,
        collection_image, groups_json, active, display_order
      ) VALUES (?, 'gloves', ?, ?, ?, ?, ?, '', '', ?, 1, ?)`,
      [
        'Gloves',
        'Gloves',
        'Sport & Safety Gloves',
        'Custom Gloves For Work And Sport',
        'Custom safety, goalkeeper and golf gloves manufactured for performance and protection.',
        'Explore safety gloves, goalkeeper gloves and golf gloves with custom materials, sizing and branding.',
        JSON.stringify([{ title: 'Gloves Collection', items: gloves.map((item) => item.name) }]),
        8,
      ]
    )

    const [[category]] = await connection.execute(
      "SELECT id FROM categories WHERE slug = 'gloves' LIMIT 1"
    )

    for (const [index, item] of gloves.entries()) {
      const [existing] = await connection.execute(
        'SELECT id, category_id FROM products WHERE slug = ? ORDER BY CASE WHEN category_id = ? THEN 0 ELSE 1 END, id ASC',
        [item.slug, category.id]
      )

      if (existing.some((row) => Number(row.category_id) === Number(category.id))) {
        continue
      }

      if (existing.length) {
        // Retain the old row ID, uploaded image BLOB and manually edited details.
        await connection.execute(
          'UPDATE products SET category_id = ?, group_name = ?, active = 1, display_order = ? WHERE id = ?',
          [category.id, 'Gloves Collection', index + 1, existing[0].id]
        )
      } else {
        await connection.execute(
          `INSERT INTO products (
            category_id, name, slug, group_name, description, image,
            features_json, featured, active, display_order
          ) VALUES (?, ?, ?, ?, ?, '', ?, 0, 1, ?)`,
          [
            category.id, item.name, item.slug, 'Gloves Collection',
            item.description, JSON.stringify(item.features), index + 1,
          ]
        )
      }
    }

    const [accessories] = await connection.execute(
      "SELECT id, groups_json FROM categories WHERE slug = 'accessories' LIMIT 1"
    )

    if (accessories.length) {
      const row = accessories[0]
      let groups = []

      try {
        groups = typeof row.groups_json === 'string'
          ? JSON.parse(row.groups_json || '[]')
          : row.groups_json || []
      } catch {
        groups = []
      }

      const cleaned = groups.map((group) => ({
        ...group,
        items: (group.items || []).filter(
          (name) => !/^(safety|goal\s*keeper|goalkeeper|golf)\s+gloves$/i.test(String(name).trim())
        ),
      }))

      if (JSON.stringify(groups) !== JSON.stringify(cleaned)) {
        await connection.execute(
          'UPDATE categories SET groups_json = ? WHERE id = ?',
          [JSON.stringify(cleaned), row.id]
        )
      }
    }

    await connection.commit()
    console.log('Gloves category ready with Safety, Goalkeeper and Golf Gloves.')
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
