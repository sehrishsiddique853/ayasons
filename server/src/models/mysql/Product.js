import pool from '../../config/mysql.js'


const parseJson = (
  value,
  fallback = []
) => {
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


const getBaseUrl = (
  req
) => {
  const configured =
    process.env.SERVER_URL
      ?.trim()
      ?.replace(/\/+$/, '')

  return (
    configured ||
    `${req.protocol}://${req.get('host')}`
  )
}


const formatProduct = (
  row,
  req
) => {
  return {
    id: row.id,

    _id: row.id,

    name: row.name,

    slug: row.slug,

    category: {
      id:
        row.category_id,

      _id:
        row.category_id,

      name:
        row.category_name,

      slug:
        row.category_slug,
    },

    group:
      row.group_name || '',

    description:
      row.description || '',

    image: {
      url:
        `${getBaseUrl(req)}/api/images/products/${row.id}`,

      publicId: '',
    },

    features:
      parseJson(
        row.features_json,
        []
      ),

    featured:
      Boolean(row.featured),

    active:
      Boolean(row.active),

    order:
      row.display_order,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  }
}


/**
 * --------------------------------------------------------------------------
 * Get All Public Products
 * --------------------------------------------------------------------------
 */

export const findActiveProducts =
  async (
    req,
    {
      featured = false,
    } = {}
  ) => {
    let sql = `
      SELECT
        p.id,
        p.category_id,
        p.name,
        p.slug,
        p.group_name,
        p.description,
        p.image,
        p.features_json,
        p.featured,
        p.active,
        p.display_order,
        p.created_at,
        p.updated_at,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p
      INNER JOIN categories c
        ON c.id = p.category_id
      WHERE
        p.active = 1
        AND c.active = 1
    `

    if (featured) {
      sql += `
        AND p.featured = 1
      `
    }

    sql += `
      ORDER BY
        p.display_order ASC,
        p.created_at ASC
    `

    const [rows] =
      await pool.execute(sql)

    return rows.map(
      (row) =>
        formatProduct(
          row,
          req
        )
    )
  }


/**
 * --------------------------------------------------------------------------
 * Get One Public Product
 * --------------------------------------------------------------------------
 */

export const findActiveProductById =
  async (
    id,
    req
  ) => {
    const [rows] =
      await pool.execute(
        `
        SELECT
          p.id,
          p.category_id,
          p.name,
          p.slug,
          p.group_name,
          p.description,
          p.image,
          p.features_json,
          p.featured,
          p.active,
          p.display_order,
          p.created_at,
          p.updated_at,
          c.name AS category_name,
          c.slug AS category_slug
        FROM products p
        INNER JOIN categories c
          ON c.id = p.category_id
        WHERE
          p.id = ?
          AND p.active = 1
          AND c.active = 1
        LIMIT 1
        `,
        [
          id,
        ]
      )

    if (
      rows.length === 0
    ) {
      return null
    }

    return formatProduct(
      rows[0],
      req
    )
  }


/**
 * --------------------------------------------------------------------------
 * Get Category + Its Products
 * --------------------------------------------------------------------------
 */

export const findActiveProductsByCategory =
  async (
    slug,
    req
  ) => {
    /**
     * ------------------------------------------------------------------------
     * Find Category
     * ------------------------------------------------------------------------
     */

    const [
      categoryRows,
    ] =
      await pool.execute(
        `
        SELECT
          id,
          name,
          slug,
          groups_json
        FROM categories
        WHERE
          slug = ?
          AND active = 1
        LIMIT 1
        `,
        [
          slug.toLowerCase(),
        ]
      )

    if (
      categoryRows.length === 0
    ) {
      return null
    }

    const categoryRow =
      categoryRows[0]


    /**
     * ------------------------------------------------------------------------
     * Find Products
     * ------------------------------------------------------------------------
     */

    const [productRows] =
      await pool.execute(
        `
        SELECT
          p.id,
          p.category_id,
          p.name,
          p.slug,
          p.group_name,
          p.description,
          p.image,
          p.features_json,
          p.featured,
          p.active,
          p.display_order,
          p.created_at,
          p.updated_at,
          c.name AS category_name,
          c.slug AS category_slug
        FROM products p
        INNER JOIN categories c
          ON c.id = p.category_id
        WHERE
          p.category_id = ?
          AND p.active = 1
          AND c.active = 1
        ORDER BY
          p.display_order ASC,
          p.created_at ASC
        `,
        [
          categoryRow.id,
        ]
      )

    return {
      category: {
        id:
          categoryRow.id,

        _id:
          categoryRow.id,

        name:
          categoryRow.name,

        slug:
          categoryRow.slug,

        groups:
          parseJson(
            categoryRow.groups_json,
            []
          ),
      },

      products:
        productRows.map(
          (row) =>
            formatProduct(
              row,
              req
            )
        ),
    }
  }