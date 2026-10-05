import pool from './mysql.js'

const defaultItems = [
  {
    name: 'Jersey / Shirt',
    slug: 'jersey-shirt',
    description: 'Custom soccer jersey with team logo, player name, player number and short or long sleeve options.',
    sizes: ['XS','S','M','L','XL','2XL','3XL','4XL'],
    colors: [
      { name: 'Black', value: '#080808' },
      { name: 'White', value: '#ffffff' },
      { name: 'Red', value: '#e10600' },
      { name: 'Royal Blue', value: '#0047ab' },
      { name: 'Green', value: '#00a651' },
      { name: 'Gold', value: '#f5d000' }
    ],
    optionGroups: [
      { name: 'Sleeve Style', slug: 'sleeve-style', values: ['Short Sleeve','Long Sleeve'] }
    ],
    allowLogoUpload: 1,
    allowPlayerName: 1,
    allowPlayerNumber: 1,
    order: 1,
  },
  {
    name: 'Soccer Shorts',
    slug: 'soccer-shorts',
    description: 'Matching performance shorts with team branding and optional player number.',
    sizes: ['XS','S','M','L','XL','2XL','3XL','4XL'],
    colors: [
      { name: 'Black', value: '#080808' },
      { name: 'White', value: '#ffffff' },
      { name: 'Red', value: '#e10600' },
      { name: 'Royal Blue', value: '#0047ab' }
    ],
    optionGroups: [],
    allowLogoUpload: 1,
    allowPlayerName: 0,
    allowPlayerNumber: 1,
    order: 2,
  },
  {
    name: 'Soccer Socks',
    slug: 'soccer-socks',
    description: 'Long team socks designed to cover shin guards with coordinated team colors.',
    sizes: ['Youth','S','M','L','XL'],
    colors: [
      { name: 'Black', value: '#080808' },
      { name: 'White', value: '#ffffff' },
      { name: 'Red', value: '#e10600' },
      { name: 'Royal Blue', value: '#0047ab' }
    ],
    optionGroups: [],
    allowLogoUpload: 0,
    allowPlayerName: 0,
    allowPlayerNumber: 0,
    order: 3,
  },
  {
    name: 'Shin Guards',
    slug: 'shin-guards',
    description: 'Protective shin guards for training and match use with custom color options.',
    sizes: ['Youth S','Youth M','Youth L','Adult S','Adult M','Adult L'],
    colors: [
      { name: 'Black', value: '#080808' },
      { name: 'White', value: '#ffffff' },
      { name: 'Red', value: '#e10600' },
      { name: 'Royal Blue', value: '#0047ab' }
    ],
    optionGroups: [],
    allowLogoUpload: 0,
    allowPlayerName: 0,
    allowPlayerNumber: 0,
    order: 4,
  },
  {
    name: 'Soccer Cleats / Boots',
    slug: 'soccer-cleats-boots',
    description: 'Studded soccer footwear for field performance with flexible sizing and color customization.',
    sizes: ['US 5','US 6','US 7','US 8','US 9','US 10','US 11','US 12','US 13'],
    colors: [
      { name: 'Black', value: '#080808' },
      { name: 'White', value: '#ffffff' },
      { name: 'Red', value: '#e10600' },
      { name: 'Royal Blue', value: '#0047ab' }
    ],
    optionGroups: [],
    allowLogoUpload: 0,
    allowPlayerName: 0,
    allowPlayerNumber: 0,
    order: 5,
  },
]

export const ensureProductCustomizerSchema = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS product_customizer_items (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      product_id BIGINT UNSIGNED NOT NULL,
      name VARCHAR(150) NOT NULL,
      slug VARCHAR(180) NOT NULL,
      description TEXT NULL,
      image_blob LONGBLOB NULL,
      image_mime VARCHAR(100) NULL,
      image_name VARCHAR(255) NULL,
      sizes_json JSON NULL,
      colors_json JSON NULL,
      option_groups_json JSON NULL,
      allow_custom_color BOOLEAN NOT NULL DEFAULT TRUE,
      allow_logo_upload BOOLEAN NOT NULL DEFAULT FALSE,
      allow_player_name BOOLEAN NOT NULL DEFAULT FALSE,
      allow_player_number BOOLEAN NOT NULL DEFAULT FALSE,
      allow_custom_notes BOOLEAN NOT NULL DEFAULT TRUE,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      display_order INT UNSIGNED NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_customizer_product_slug (product_id, slug),
      KEY idx_customizer_product_active_order (product_id, active, display_order),
      CONSTRAINT fk_customizer_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON UPDATE CASCADE ON DELETE CASCADE
    )
  `)

  const [products] = await pool.execute(`
    SELECT p.id
    FROM products p
    INNER JOIN categories c ON c.id = p.category_id
    WHERE p.slug = 'soccer-uniform' AND c.slug = 'sportswear'
    LIMIT 1
  `)

  if (!products.length) return

  const productId = products[0].id
  const [existing] = await pool.execute(
    'SELECT COUNT(*) AS total FROM product_customizer_items WHERE product_id = ?',
    [productId]
  )

  if (Number(existing[0].total) > 0) return

  for (const item of defaultItems) {
    await pool.execute(`
      INSERT INTO product_customizer_items (
        product_id, name, slug, description,
        sizes_json, colors_json, option_groups_json,
        allow_custom_color, allow_logo_upload,
        allow_player_name, allow_player_number,
        allow_custom_notes, active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, 1, 1, ?)
    `, [
      productId, item.name, item.slug, item.description,
      JSON.stringify(item.sizes), JSON.stringify(item.colors),
      JSON.stringify(item.optionGroups), item.allowLogoUpload,
      item.allowPlayerName, item.allowPlayerNumber, item.order,
    ])
  }
}
