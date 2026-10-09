import pool from './mysql.js'

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']

const STANDARD_COLORS = [
  { name: 'Black', value: '#080808' },
  { name: 'White', value: '#ffffff' },
  { name: 'Charcoal', value: '#34383d' },
  { name: 'Navy', value: '#14213d' },
  { name: 'Red', value: '#e10600' },
  { name: 'Royal Blue', value: '#0047ab' },
  { name: 'Olive', value: '#66713f' },
  { name: 'Beige', value: '#d8c7a6' },
]

const slugify = (value = '') =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const group = (name, values) => ({
  name,
  slug: slugify(name),
  values,
})

const item = ({
  product,
  description,
  sizes = STANDARD_SIZES,
  colorZones = ['Main Color', 'Secondary Color', 'Trim / Accent Color'],
  optionGroups = [],
  specifications = [],
  basic = [],
}) => ({
  product,
  description,
  sizes,
  colors: STANDARD_COLORS,
  colorZones,
  optionGroups,
  specifications,
  basic,
  required: sizes.length ? ['size', 'color'] : ['color'],
})

const streetwearCustomizers = [
  item({
    product: 'Hoodies',
    description: 'Custom hoodie designed for streetwear brands, teams and private-label collections.',
    colorZones: ['Body Main Color', 'Sleeve Color', 'Hood Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Oversized', 'Slim']),
      group('Hood Style', ['Standard Hood', 'Double Layer Hood', 'Oversized Hood']),
      group('Closure', ['Pullover', 'Full Zip', 'Half Zip']),
      group('Pocket Style', ['Kangaroo Pocket', 'Side Pockets', 'No Pocket']),
      group('Fabric', ['Cotton Fleece', 'Poly Cotton Fleece', 'French Terry']),
      group('Fabric Weight', ['Lightweight', 'Midweight', 'Heavyweight']),
      group('Cuff Style', ['Rib Cuff', 'Plain Cuff']),
      group('Hem Style', ['Rib Hem', 'Straight Hem']),
      group('Decoration', ['Embroidery', 'Screen Print', 'Heat Transfer', 'Patch']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom streetwear hoodie' },
      { label: 'Use', value: 'Streetwear, teams and private-label collections' },
    ],
    basic: ['size', 'fit'],
  }),

  item({
    product: 'Trousers',
    description: 'Custom streetwear trousers with flexible fit, fabric and finishing options.',
    colorZones: ['Main Color', 'Side Panel Color', 'Waistband Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Relaxed', 'Slim', 'Tapered']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord', 'Fixed Waist']),
      group('Leg Style', ['Straight', 'Tapered', 'Wide Leg']),
      group('Hem Style', ['Open Hem', 'Elastic Cuff', 'Zip Cuff']),
      group('Pocket Style', ['Side Pocket', 'Zip Pocket', 'Cargo Pocket', 'No Pocket']),
      group('Fabric', ['Cotton Twill', 'Poly Cotton', 'Stretch Woven', 'Fleece']),
      group('Decoration', ['Embroidery', 'Screen Print', 'Heat Transfer', 'Patch']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom streetwear trousers' },
      { label: 'Use', value: 'Lifestyle, casual and branded apparel collections' },
    ],
    basic: ['size', 'fit'],
  }),

  item({
    product: 'T-Shirts',
    description: 'Custom T-shirt for streetwear, merchandise and private-label collections.',
    colorZones: ['Body Main Color', 'Sleeve Color', 'Neck Rib Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Oversized', 'Slim']),
      group('Sleeve Length', ['Short Sleeve', 'Long Sleeve']),
      group('Neck Style', ['Crew Neck', 'V Neck', 'Mock Neck']),
      group('Fabric', ['Cotton Jersey', 'Heavy Cotton', 'Poly Cotton', 'Dry Fit']),
      group('Fabric Weight', ['Lightweight', 'Midweight', 'Heavyweight']),
      group('Hem Style', ['Straight Hem', 'Curved Hem']),
      group('Decoration', ['Screen Print', 'DTF / Heat Transfer', 'Embroidery', 'Sublimation']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom streetwear T-shirt' },
      { label: 'Use', value: 'Merchandise, lifestyle and private-label collections' },
    ],
    basic: ['size', 'fit'],
  }),

  item({
    product: 'Tracksuits',
    description: 'Matching custom tracksuit with coordinated jacket and pants for lifestyle and team collections.',
    colorZones: ['Jacket Main Color', 'Jacket Secondary Color', 'Pants Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Jacket Fit', ['Regular', 'Athletic', 'Slim']),
      group('Jacket Style', ['Full Zip', 'Half Zip', 'Pullover']),
      group('Collar Style', ['Stand Collar', 'Hooded', 'Crew Neck']),
      group('Pants Fit', ['Regular', 'Tapered', 'Slim']),
      group('Pant Cuff', ['Open Hem', 'Elastic Cuff', 'Zip Cuff']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord']),
      group('Fabric', ['Tricot Polyester', 'Interlock', 'Microfiber', 'Fleece']),
      group('Pocket Style', ['Side Pocket', 'Zip Pocket', 'No Pocket']),
      group('Decoration', ['Embroidery', 'Heat Transfer', 'Screen Print', 'Sublimation']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Matching jacket and pants' },
      { label: 'Use', value: 'Streetwear, travel, teams and lifestyle collections' },
    ],
    basic: ['size', 'jacket-fit', 'pants-fit'],
  }),

  item({
    product: 'Sweatsuits',
    description: 'Coordinated sweatshirt and sweatpants set for casual, streetwear and branded collections.',
    colorZones: ['Top Main Color', 'Top Secondary Color', 'Pant Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Top Style', ['Crewneck Sweatshirt', 'Hoodie', 'Zip Sweatshirt']),
      group('Top Fit', ['Regular', 'Oversized', 'Slim']),
      group('Pant Fit', ['Regular', 'Relaxed', 'Tapered']),
      group('Pant Cuff', ['Elastic Cuff', 'Open Hem']),
      group('Fabric', ['Cotton Fleece', 'Poly Cotton Fleece', 'French Terry']),
      group('Fabric Weight', ['Midweight', 'Heavyweight']),
      group('Decoration', ['Embroidery', 'Screen Print', 'Heat Transfer', 'Patch']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Sweatshirt or hoodie with matching sweatpants' },
      { label: 'Use', value: 'Casual and streetwear collections' },
    ],
    basic: ['size', 'top-style'],
  }),

  item({
    product: 'Sweat Pant',
    description: 'Custom sweatpants with casual comfort, flexible fits and brand-ready decoration options.',
    colorZones: ['Main Color', 'Side Panel Color', 'Waistband Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Relaxed', 'Tapered', 'Slim']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord']),
      group('Cuff Style', ['Elastic Cuff', 'Open Hem']),
      group('Pocket Style', ['Side Pocket', 'Zip Pocket', 'Back Pocket', 'No Pocket']),
      group('Fabric', ['Cotton Fleece', 'Poly Cotton Fleece', 'French Terry']),
      group('Decoration', ['Embroidery', 'Screen Print', 'Heat Transfer', 'Patch']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom sweat pant' },
      { label: 'Use', value: 'Streetwear, casual and training collections' },
    ],
    basic: ['size', 'fit'],
  }),

  item({
    product: 'Sweat Shirt',
    description: 'Custom sweatshirt for casual and streetwear collections with multiple fabrics and finishes.',
    colorZones: ['Body Main Color', 'Sleeve Color', 'Rib Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Oversized', 'Slim']),
      group('Neck Style', ['Crew Neck', 'Mock Neck', 'Quarter Zip']),
      group('Sleeve Style', ['Set-In Sleeve', 'Raglan Sleeve']),
      group('Fabric', ['Cotton Fleece', 'Poly Cotton Fleece', 'French Terry']),
      group('Fabric Weight', ['Midweight', 'Heavyweight']),
      group('Cuff Style', ['Rib Cuff', 'Plain Cuff']),
      group('Decoration', ['Embroidery', 'Screen Print', 'Heat Transfer', 'Patch']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom sweatshirt' },
      { label: 'Use', value: 'Lifestyle and streetwear collections' },
    ],
    basic: ['size', 'fit'],
  }),

  item({
    product: 'Shorts',
    description: 'Custom casual shorts designed for streetwear, lifestyle and warm-weather collections.',
    colorZones: ['Main Color', 'Side Panel Color', 'Waistband Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Relaxed', 'Athletic']),
      group('Length', ['Short', 'Above Knee', 'Knee Length']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord']),
      group('Pocket Style', ['Side Pocket', 'Zip Pocket', 'Cargo Pocket', 'No Pocket']),
      group('Fabric', ['Cotton Twill', 'Fleece', 'Polyester', 'Nylon']),
      group('Decoration', ['Embroidery', 'Screen Print', 'Heat Transfer', 'Patch']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom casual shorts' },
      { label: 'Use', value: 'Streetwear and lifestyle collections' },
    ],
    basic: ['size', 'fit', 'length'],
  }),

  item({
    product: '3 Quarter Shorts',
    description: 'Custom three-quarter shorts with relaxed styling and flexible branding options.',
    colorZones: ['Main Color', 'Side Panel Color', 'Waistband Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Relaxed', 'Tapered']),
      group('Length', ['Below Knee', 'Mid Calf']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord']),
      group('Pocket Style', ['Side Pocket', 'Zip Pocket', 'Cargo Pocket']),
      group('Fabric', ['Cotton Twill', 'Fleece', 'Poly Cotton', 'Nylon']),
      group('Decoration', ['Embroidery', 'Screen Print', 'Heat Transfer', 'Patch']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom three-quarter shorts' },
      { label: 'Use', value: 'Casual, lifestyle and streetwear collections' },
    ],
    basic: ['size', 'fit'],
  }),

  item({
    product: 'Windbreaker Sets',
    description: 'Lightweight custom windbreaker jacket and pants set for travel, lifestyle and team collections.',
    colorZones: ['Jacket Main Color', 'Jacket Secondary Color', 'Pants Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Jacket Style', ['Full Zip', 'Half Zip', 'Pullover']),
      group('Jacket Fit', ['Regular', 'Relaxed', 'Athletic']),
      group('Hood Style', ['No Hood', 'Fixed Hood', 'Packable Hood']),
      group('Pants Fit', ['Regular', 'Tapered']),
      group('Pant Cuff', ['Open Hem', 'Elastic Cuff', 'Zip Cuff']),
      group('Fabric', ['Nylon', 'Polyester Taslan', 'Microfiber']),
      group('Lining', ['Unlined', 'Mesh Lined', 'Light Fleece Lined']),
      group('Pocket Style', ['Side Pocket', 'Zip Pocket']),
      group('Decoration', ['Embroidery', 'Heat Transfer', 'Screen Print']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Windbreaker jacket and matching pants' },
      { label: 'Use', value: 'Travel, lifestyle and lightweight outerwear' },
    ],
    basic: ['size', 'jacket-style'],
  }),

  item({
    product: 'Denim Jeans Pants',
    description: 'Custom denim jeans with brand-led fits, washes, trims and private-label details.',
    colorZones: ['Denim / Wash Color', 'Stitch Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', ['28', '30', '32', '34', '36', '38', '40', '42']),
      group('Fit', ['Slim', 'Straight', 'Relaxed', 'Baggy', 'Tapered']),
      group('Rise', ['Low Rise', 'Mid Rise', 'High Rise']),
      group('Wash', ['Raw / Rinse', 'Light Wash', 'Medium Wash', 'Dark Wash', 'Vintage Wash']),
      group('Leg Opening', ['Straight', 'Tapered', 'Wide']),
      group('Pocket Style', ['5 Pocket', 'Cargo Pocket']),
      group('Denim Weight', ['Lightweight', 'Midweight', 'Heavyweight']),
      group('Stretch', ['Rigid Denim', 'Comfort Stretch', 'Stretch Denim']),
      group('Finish', ['Clean', 'Distressed', 'Ripped']),
      group('Branding', ['Leather Patch', 'Woven Label', 'Embroidery', 'Metal Badge']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom denim jeans' },
      { label: 'Use', value: 'Streetwear and private-label denim collections' },
    ],
    basic: ['size', 'fit', 'wash'],
  }),

  item({
    product: 'Denim Shorts',
    description: 'Custom denim shorts with selectable washes, fits, hems and private-label branding.',
    colorZones: ['Denim / Wash Color', 'Stitch Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', ['28', '30', '32', '34', '36', '38', '40', '42']),
      group('Fit', ['Slim', 'Regular', 'Relaxed', 'Baggy']),
      group('Length', ['Short', 'Mid Thigh', 'Above Knee', 'Knee Length']),
      group('Wash', ['Light Wash', 'Medium Wash', 'Dark Wash', 'Vintage Wash']),
      group('Hem Style', ['Clean Hem', 'Raw Hem', 'Cuffed Hem']),
      group('Stretch', ['Rigid Denim', 'Comfort Stretch', 'Stretch Denim']),
      group('Finish', ['Clean', 'Distressed', 'Ripped']),
      group('Branding', ['Leather Patch', 'Woven Label', 'Embroidery', 'Metal Badge']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom denim shorts' },
      { label: 'Use', value: 'Seasonal and streetwear denim collections' },
    ],
    basic: ['size', 'fit', 'wash'],
  }),

  item({
    product: 'Tank Tops',
    description: 'Custom tank top for casual, summer, gym and streetwear collections.',
    colorZones: ['Body Main Color', 'Neck / Binding Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Relaxed', 'Slim', 'Athletic']),
      group('Neck Style', ['Crew Neck', 'Scoop Neck', 'Deep Neck']),
      group('Armhole Style', ['Standard', 'Wide Cut', 'Muscle Cut']),
      group('Length', ['Standard', 'Longline', 'Cropped']),
      group('Fabric', ['Cotton Jersey', 'Poly Cotton', 'Dry Fit', 'Rib Knit']),
      group('Fabric Weight', ['Lightweight', 'Midweight']),
      group('Decoration', ['Screen Print', 'Heat Transfer', 'Embroidery', 'Sublimation']),
    ],
    specifications: [
      { label: 'Product', value: 'Custom tank top' },
      { label: 'Use', value: 'Streetwear, summer and lifestyle collections' },
    ],
    basic: ['size', 'fit'],
  }),
]

export const ensureStreetwearCustomizers = async () => {
  const [categories] = await pool.execute(
    "SELECT id FROM categories WHERE slug = 'streetwear' LIMIT 1"
  )

  if (!categories.length) return

  const categoryId = categories[0].id

  for (const config of streetwearCustomizers) {
    const productSlug = slugify(config.product)

    const [products] = await pool.execute(
      `SELECT id FROM products
       WHERE category_id = ? AND slug = ?
       LIMIT 1`,
      [categoryId, productSlug]
    )

    if (!products.length) continue

    const productId = products[0].id

    // Preserve any older generic customizer row, but hide it once design
    // variants are available.
    await pool.execute(
      `UPDATE product_customizer_items
       SET active = 0
       WHERE product_id = ?
         AND slug = ?`,
      [productId, productSlug]
    )

    for (let variant = 1; variant <= 3; variant += 1) {
      const variantName = `${config.product} ${variant}`
      const variantSlug = slugify(variantName)

      await pool.execute(
        `INSERT IGNORE INTO product_customizer_items (
          product_id,
          name,
          slug,
          description,
          sizes_json,
          colors_json,
          color_zones_json,
          option_groups_json,
          specifications_json,
          default_options_json,
          basic_option_slugs_json,
          required_fields_json,
          default_color_mode,
          preset_colors_json,
          allow_custom_color,
          allow_logo_upload,
          allow_player_name,
          allow_player_number,
          allow_custom_notes,
          active,
          display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 0, 0, 1, 1, ?)`,
        [
          productId,
          variantName,
          variantSlug,
          `${config.description} Design ${variant}.`,
          JSON.stringify(config.sizes),
          JSON.stringify(config.colors),
          JSON.stringify(config.colorZones),
          JSON.stringify(config.optionGroups),
          JSON.stringify([
            ...config.specifications,
            { label: 'Design', value: `Design ${variant}` },
          ]),
          JSON.stringify({}),
          JSON.stringify(config.basic),
          JSON.stringify(config.required),
          'custom',
          JSON.stringify({}),
          variant,
        ]
      )
    }
  }
}
