import pool from './mysql.js'

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
    const productNames = safetyProducts.map((item) => item.name)
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

    for (const item of safetyProducts) {
      const [sameNameProducts] = await connection.execute(
        `SELECT id, slug
         FROM products
         WHERE category_id = ? AND LOWER(name) = LOWER(?)
         ORDER BY id`,
        [category.id, item.name]
      )

      const canonicalProduct = sameNameProducts.find(
        (product) => product.slug === item.slug
      )

      if (canonicalProduct) {
        await connection.execute(
          `UPDATE products
           SET active = (id = ?)
           WHERE category_id = ? AND LOWER(name) = LOWER(?)`,
          [canonicalProduct.id, category.id, item.name]
        )
        continue
      }

      if (sameNameProducts.length) {
        await connection.execute(
          `UPDATE products
           SET active = 0
           WHERE category_id = ? AND LOWER(name) = LOWER(?)`,
          [category.id, item.name]
        )
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
