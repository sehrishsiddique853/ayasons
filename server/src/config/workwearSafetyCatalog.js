import pool from './mysql.js'
import { validSeedRecords } from '../utils/seedValidation.js'

const safetyProducts = [
  {
    name: 'Safety Jacket',
    slug: 'safety-jacket',
    description: 'Custom high-visibility safety jackets designed for work crews, industrial teams and branded PPE programs.',
    features: ['High Visibility', 'Reflective Tape', 'Custom Branding'],
  },
  {
    name: 'Safety Vest',
    slug: 'safety-vest',
    description: 'Custom high-visibility safety vests for work crews, events, logistics and branded safety programs.',
    features: ['High Visibility', 'Reflective Tape', 'Custom Branding'],
  },
]

export const ensureWorkwearSafetyProducts = async () => {
  const validProducts = validSeedRecords(safetyProducts, 'workwear safety product', (item) =>
    typeof item.slug === 'string' &&
    Boolean(item.slug.trim()) &&
    Array.isArray(item.features) &&
    item.features.every((feature) => typeof feature === 'string')
  )
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [[category]] = await connection.execute(
      "SELECT id, groups_json FROM categories WHERE slug = 'workwear' LIMIT 1"
    )

    if (!category) {
      await connection.rollback()
      return
    }

    let groups = []

    try {
      groups = typeof category.groups_json === 'string'
        ? JSON.parse(category.groups_json || '[]')
        : category.groups_json || []
    } catch {
      groups = []
    }

    const targetGroupTitle = 'Safety and Workwear Collection'
    const productNames = validProducts.map((item) => item.name)
    const existingGroup = groups.find((group) => group.title === targetGroupTitle)

    if (existingGroup) {
      existingGroup.items = [
        ...new Set([...(existingGroup.items || []), ...productNames]),
      ]
    } else {
      groups.push({
        title: targetGroupTitle,
        items: productNames,
      })
    }

    await connection.execute(
      'UPDATE categories SET groups_json = ? WHERE id = ?',
      [JSON.stringify(groups), category.id]
    )

    const [[orderRow]] = await connection.execute(
      'SELECT COALESCE(MAX(display_order), 0) AS max_order FROM products WHERE category_id = ?',
      [category.id]
    )

    let nextOrder = Number(orderRow?.max_order || 0) + 1

    for (const item of validProducts) {
      const [existing] = await connection.execute(
        'SELECT id FROM products WHERE category_id = ? AND slug = ? LIMIT 1',
        [category.id, item.slug]
      )

      if (existing.length) {
        await connection.execute(
          'UPDATE products SET active = 1 WHERE id = ?',
          [existing[0].id]
        )
        continue
      }

      await connection.execute(
        `INSERT INTO products (
          category_id, name, slug, group_name, description, image,
          features_json, featured, active, display_order
        ) VALUES (?, ?, ?, ?, ?, '', ?, 0, 1, ?)`,
        [
          category.id,
          item.name,
          item.slug,
          targetGroupTitle,
          item.description,
          JSON.stringify(item.features),
          nextOrder,
        ]
      )

      nextOrder += 1
    }

    await connection.commit()
    console.log('Safety Jacket and Safety Vest products are ready.')
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
