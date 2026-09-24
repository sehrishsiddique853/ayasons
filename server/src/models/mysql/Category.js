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


const buildImageUrl = (
  req,
  imagePath
) => {
  if (!imagePath) {
    return ''
  }


  if (
    imagePath.startsWith(
      'http://'
    ) ||
    imagePath.startsWith(
      'https://'
    )
  ) {
    return imagePath
  }


  const configuredBaseUrl =
    process.env.SERVER_URL
      ?.trim()
      ?.replace(/\/+$/, '')


  const baseUrl =
    configuredBaseUrl ||
    `${req.protocol}://${req.get('host')}`


  return `${baseUrl}${
    imagePath.startsWith('/')
      ? imagePath
      : `/${imagePath}`
  }`
}


const formatCategory = (
  row,
  req
) => {
  return {
    id: row.id,

    name: row.name,

    slug: row.slug,

    eyebrow:
      row.eyebrow || '',

    showcaseLabel:
      row.showcase_label || '',

    heroTitle:
      row.hero_title || '',

    description:
      row.description || '',

    collectionDescription:
      row.collection_description ||
      '',

    heroImage: {
      url:
        buildImageUrl(
          req,
          row.hero_image
        ),

      publicId: '',
    },

    collectionImage: {
      url:
        buildImageUrl(
          req,
          row.collection_image
        ),

      publicId: '',
    },

    groups:
      parseJson(
        row.groups_json,
        []
      ),

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
          hero_image,
          collection_image,
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
          hero_image,
          collection_image,
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