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
  return ''
}


const getMediaVersion = (
  value
) => {

  const timestamp =
    value
      ? new Date(
          value
        ).getTime()
      : NaN


  return Number.isFinite(
    timestamp
  )
    ? timestamp
    : 1
}

const formatCategoryText = (value, isWorkwearCategory) => {
  if (!isWorkwearCategory || typeof value !== 'string') {
    return value
  }

  return value.replace(/workwear/gi, (match) =>
    match[0] === match[0].toUpperCase()
      ? 'Safety and Workwear'
      : 'safety and workwear'
  )
}


const formatCategory = (
  row,
  req
) => {
  const isWorkwearCategory = row.slug === 'workwear'
  const groups = parseJson(row.groups_json, []).map((group) => ({
    ...group,
    title: formatCategoryText(group.title, isWorkwearCategory),
  }))

  return {
    id: row.id,

    name: isWorkwearCategory ? 'Safety and Workwear' : row.name,

    slug: row.slug,

    eyebrow: formatCategoryText(row.eyebrow || '', isWorkwearCategory),

    showcaseLabel: formatCategoryText(row.showcase_label || '', isWorkwearCategory),

    heroTitle:
      row.hero_title || '',

    description: formatCategoryText(row.description || '', isWorkwearCategory),

    collectionDescription: formatCategoryText(row.collection_description || '', isWorkwearCategory),

    heroImage: {
      url:
        `${getBaseUrl(req)}/api/images/categories/${row.id}/hero?v=${getMediaVersion(
          row.updated_at
        )}`,

      publicId: '',
    },

    collectionImage: {
      url:
        `${getBaseUrl(req)}/api/images/categories/${row.id}/collection?v=${getMediaVersion(
          row.updated_at
        )}`,

      publicId: '',
    },

    groups,

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


export const findActiveCategories =
  async (req) => {
    const [rows] =
      await pool.execute(`
        SELECT
          id,
          name,
          slug,
          eyebrow,
          showcase_label,
          hero_title,
          description,
          collection_description,
          groups_json,
          active,
          display_order,
          created_at,
          updated_at
        FROM categories
        WHERE active = 1
        ORDER BY
          display_order ASC,
          created_at ASC
      `)

    return rows.map(
      (row) =>
        formatCategory(
          row,
          req
        )
    )
  }


export const findActiveCategoryBySlug =
  async (
    slug,
    req
  ) => {
    const [rows] =
      await pool.execute(
        `
        SELECT
          id,
          name,
          slug,
          eyebrow,
          showcase_label,
          hero_title,
          description,
          collection_description,
          groups_json,
          active,
          display_order,
          created_at,
          updated_at
        FROM categories
        WHERE slug = ?
          AND active = 1
        LIMIT 1
        `,
        [
          slug.toLowerCase(),
        ]
      )

    if (
      rows.length === 0
    ) {
      return null
    }

    return formatCategory(
      rows[0],
      req
    )
  }
