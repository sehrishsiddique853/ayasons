import pool from './mysql.js'
import { validSeedRecords } from '../utils/seedValidation.js'

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
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const group = (name, values) => ({
  name,
  slug: slugify(name),
  values,
})

const product = ({
  name,
  lookupName = name,
  description,
  sizes = STANDARD_SIZES,
  colorZones = ['Main Color', 'Secondary Color', 'Trim / Accent Color'],
  optionGroups = [],
  specifications = [],
  basic = [],
}) => ({
  name,
  lookupName,
  description,
  sizes,
  colors: STANDARD_COLORS,
  colorZones,
  optionGroups,
  specifications,
  basic,
  required: sizes.length ? ['size', 'color'] : ['color'],
})

const activewearCustomizers = [
  product({
    name: "Men's Tops / T-Shirts",
    description: 'Custom men’s activewear tops and T-shirts for gym, training, fitness and private-label performance collections.',
    colorZones: ['Body Main Color', 'Sleeve Color', 'Neck / Binding Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Athletic', 'Slim', 'Compression']),
      group('Sleeve Length', ['Short Sleeve', 'Long Sleeve']),
      group('Neck Style', ['Crew Neck', 'V Neck', 'Mock Neck']),
      group('Fabric', ['Dry Fit Polyester', 'Poly Spandex', 'Micro Mesh', 'Performance Jersey']),
      group('Fabric Weight', ['Lightweight', 'Midweight']),
      group('Hem Style', ['Straight Hem', 'Curved Hem']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Screen Print', 'Embroidery']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Men’s performance top / T-shirt' },
      { label: 'Branding Detail', value: 'Custom colors, logos and branded detailing' },
      { label: 'Customization Detail', value: 'Selectable fit, sleeve, neck, fabric and decoration options' },
      { label: 'Use', value: 'Gym, fitness, training and activewear collections' },
    ],
    basic: ['size', 'fit'],
  }),

  product({
    name: "Men's Bottoms / Trousers",
    description: 'Custom men’s activewear bottoms and trousers for gym, fitness, warm-up and training collections.',
    colorZones: ['Main Color', 'Side Panel Color', 'Waistband Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Athletic', 'Tapered', 'Slim']),
      group('Leg Style', ['Straight', 'Tapered', 'Jogger']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord']),
      group('Hem Style', ['Open Hem', 'Elastic Cuff', 'Zip Cuff']),
      group('Pocket Style', ['Side Pocket', 'Zip Pocket', 'No Pocket']),
      group('Fabric', ['Polyester Interlock', 'Stretch Woven', 'Poly Spandex', 'Fleece']),
      group('Decoration', ['Heat Transfer', 'Screen Print', 'Embroidery', 'Sublimation']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Men’s performance bottoms / trousers' },
      { label: 'Branding Detail', value: 'Custom colors, logo and branded trim options' },
      { label: 'Customization Detail', value: 'Selectable fit, waistband, leg style, pockets and fabric' },
      { label: 'Use', value: 'Gym, fitness, training and activewear collections' },
    ],
    basic: ['size', 'fit'],
  }),

  product({
    name: "Men's Tank Tops",
    description: 'Custom men’s tank tops designed for training, gym, fitness and performance apparel collections.',
    colorZones: ['Body Main Color', 'Neck / Binding Color', 'Armhole / Trim Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Athletic', 'Slim', 'Compression']),
      group('Neck Style', ['Crew Neck', 'Scoop Neck', 'Deep Neck']),
      group('Armhole Style', ['Standard', 'Wide Cut', 'Muscle Cut']),
      group('Length', ['Standard', 'Longline']),
      group('Fabric', ['Dry Fit Polyester', 'Poly Spandex', 'Micro Mesh', 'Performance Jersey']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Screen Print']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Men’s performance tank top' },
      { label: 'Branding Detail', value: 'Custom colors, logo and branded trim options' },
      { label: 'Customization Detail', value: 'Selectable fit, neckline, armhole, length and fabric' },
      { label: 'Use', value: 'Gym, fitness and training collections' },
    ],
    basic: ['size', 'fit'],
  }),

  product({
    name: "Men's Shorts",
    description: 'Custom men’s activewear shorts for gym, training, fitness and performance collections.',
    colorZones: ['Main Color', 'Side Panel Color', 'Waistband Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Athletic', 'Relaxed', 'Compression']),
      group('Length', ['Short', 'Above Knee', 'Knee Length']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord']),
      group('Pocket Style', ['Side Pocket', 'Zip Pocket', 'No Pocket']),
      group('Inner Liner', ['No Liner', 'Mesh Liner', 'Compression Liner']),
      group('Fabric', ['Dry Fit Polyester', 'Stretch Woven', 'Poly Spandex', 'Micro Mesh']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Screen Print']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Men’s performance shorts' },
      { label: 'Branding Detail', value: 'Custom colors, logo and branded panel options' },
      { label: 'Customization Detail', value: 'Selectable length, fit, liner, pockets and fabric' },
      { label: 'Use', value: 'Gym, fitness and training collections' },
    ],
    basic: ['size', 'fit', 'length'],
  }),

  product({
    name: "Men's Compression Tops / Bottoms / Shorts",
    lookupName: 'Compression Wear',
    description: 'Custom men’s compression wear covering tops, bottoms and shorts for high-performance training and fitness collections.',
    colorZones: ['Main Color', 'Panel Color', 'Stitch / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Compression Type', ['Top', 'Full Length Bottom', '3/4 Bottom', 'Compression Shorts']),
      group('Compression Level', ['Light', 'Medium', 'Firm']),
      group('Sleeve Length', ['Sleeveless', 'Short Sleeve', 'Long Sleeve', 'Not Applicable']),
      group('Waist Rise', ['Low', 'Mid', 'High', 'Not Applicable']),
      group('Fabric', ['Poly Spandex', 'Nylon Spandex', 'Compression Knit']),
      group('Seam Style', ['Flatlock', 'Bonded', 'Standard']),
      group('Panel Style', ['Plain', 'Contrast Panel', 'Custom Panel']),
      group('Decoration', ['Heat Transfer', 'Sublimation', 'Screen Print']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Men’s compression tops, bottoms or shorts' },
      { label: 'Branding Detail', value: 'Custom colors, logo and performance branding options' },
      { label: 'Customization Detail', value: 'Selectable garment type, compression, fabric, seam and panel options' },
      { label: 'Use', value: 'High-performance gym, fitness and training collections' },
    ],
    basic: ['size', 'compression-type', 'compression-level'],
  }),

  product({
    name: "Women's Tops / T-Shirts",
    description: 'Custom women’s activewear tops and T-shirts for gym, fitness, training and private-label collections.',
    colorZones: ['Body Main Color', 'Sleeve Color', 'Neck / Binding Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Fitted', 'Slim', 'Compression']),
      group('Sleeve Length', ['Short Sleeve', 'Long Sleeve']),
      group('Neck Style', ['Crew Neck', 'V Neck', 'Scoop Neck']),
      group('Length', ['Standard', 'Longline', 'Cropped']),
      group('Fabric', ['Dry Fit Polyester', 'Poly Spandex', 'Micro Mesh', 'Performance Jersey']),
      group('Fabric Weight', ['Lightweight', 'Midweight']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Screen Print', 'Embroidery']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Women’s performance top / T-shirt' },
      { label: 'Branding Detail', value: 'Custom colors, logos and branded detailing' },
      { label: 'Customization Detail', value: 'Selectable fit, sleeve, neck, length and fabric' },
      { label: 'Use', value: 'Gym, fitness and training collections' },
    ],
    basic: ['size', 'fit'],
  }),

  product({
    name: "Women's Bottoms / Trousers",
    description: 'Custom women’s activewear bottoms and trousers for gym, fitness, warm-up and training collections.',
    colorZones: ['Main Color', 'Side Panel Color', 'Waistband Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Athletic', 'Tapered', 'Slim']),
      group('Leg Style', ['Straight', 'Tapered', 'Jogger']),
      group('Waist Rise', ['Low', 'Mid', 'High']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord', 'Wide Performance Waistband']),
      group('Hem Style', ['Open Hem', 'Elastic Cuff', 'Zip Cuff']),
      group('Pocket Style', ['Side Pocket', 'Zip Pocket', 'No Pocket']),
      group('Fabric', ['Polyester Interlock', 'Stretch Woven', 'Poly Spandex', 'Fleece']),
      group('Decoration', ['Heat Transfer', 'Screen Print', 'Embroidery', 'Sublimation']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Women’s performance bottoms / trousers' },
      { label: 'Branding Detail', value: 'Custom colors, logo and branded trim options' },
      { label: 'Customization Detail', value: 'Selectable fit, rise, waistband, pockets and fabric' },
      { label: 'Use', value: 'Gym, fitness and training collections' },
    ],
    basic: ['size', 'fit'],
  }),

  product({
    name: "Women's Tank Tops",
    description: 'Custom women’s tank tops designed for training, gym, fitness and active lifestyle collections.',
    colorZones: ['Body Main Color', 'Neck / Binding Color', 'Armhole / Trim Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Fitted', 'Slim', 'Compression']),
      group('Neck Style', ['Crew Neck', 'Scoop Neck', 'Deep Neck']),
      group('Back Style', ['Standard Back', 'Racerback', 'Crossback']),
      group('Length', ['Standard', 'Longline', 'Cropped']),
      group('Fabric', ['Dry Fit Polyester', 'Poly Spandex', 'Micro Mesh', 'Performance Jersey']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Screen Print']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Women’s performance tank top' },
      { label: 'Branding Detail', value: 'Custom colors, logo and branded trim options' },
      { label: 'Customization Detail', value: 'Selectable fit, neckline, back style, length and fabric' },
      { label: 'Use', value: 'Gym, fitness and active lifestyle collections' },
    ],
    basic: ['size', 'fit'],
  }),

  product({
    name: "Women's Sports Bra",
    lookupName: "Women's Sports Bras",
    description: 'Custom women’s sports bra designed for training and fitness collections with selectable support and styling options.',
    colorZones: ['Main Color', 'Band Color', 'Strap / Trim Color'],
    optionGroups: [
      group('Size', ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL']),
      group('Support Level', ['Light Support', 'Medium Support', 'High Support']),
      group('Back Style', ['Racerback', 'Crossback', 'Strappy Back']),
      group('Strap Style', ['Fixed Strap', 'Adjustable Strap']),
      group('Padding', ['No Padding', 'Removable Padding', 'Fixed Padding']),
      group('Band Style', ['Standard Band', 'Wide Band']),
      group('Fabric', ['Poly Spandex', 'Nylon Spandex', 'Compression Knit']),
      group('Decoration', ['Heat Transfer', 'Sublimation', 'Screen Print']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Women’s performance sports bra' },
      { label: 'Branding Detail', value: 'Custom colors, logo and branded trim options' },
      { label: 'Customization Detail', value: 'Selectable support, back, straps, padding and fabric' },
      { label: 'Use', value: 'Gym, fitness and training collections' },
    ],
    basic: ['size', 'support-level'],
  }),

  product({
    name: "Women's Shorts",
    description: 'Custom women’s activewear shorts for gym, fitness, training and performance collections.',
    colorZones: ['Main Color', 'Side Panel Color', 'Waistband Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Athletic', 'Fitted', 'Compression']),
      group('Length', ['Short', 'Mid Thigh', 'Above Knee']),
      group('Waist Rise', ['Low', 'Mid', 'High']),
      group('Waistband', ['Elastic', 'Wide Performance Waistband']),
      group('Pocket Style', ['No Pocket', 'Side Pocket', 'Hidden Pocket']),
      group('Inner Liner', ['No Liner', 'Compression Liner']),
      group('Fabric', ['Dry Fit Polyester', 'Poly Spandex', 'Stretch Woven']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Screen Print']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Women’s performance shorts' },
      { label: 'Branding Detail', value: 'Custom colors, logo and branded panel options' },
      { label: 'Customization Detail', value: 'Selectable length, fit, rise, waistband and fabric' },
      { label: 'Use', value: 'Gym, fitness and training collections' },
    ],
    basic: ['size', 'fit', 'length'],
  }),

  product({
    name: 'Leggings',
    description: 'Custom performance leggings for gym, fitness, training and active lifestyle collections.',
    colorZones: ['Main Color', 'Panel Color', 'Waistband Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Performance Fit', 'Compression Fit']),
      group('Length', ['Full Length', '7/8 Length', 'Capri']),
      group('Waist Rise', ['Mid Rise', 'High Rise', 'Extra High Rise']),
      group('Waistband Style', ['Standard', 'Wide Performance', 'Foldover']),
      group('Pocket Style', ['No Pocket', 'Side Pocket', 'Hidden Waist Pocket']),
      group('Fabric', ['Poly Spandex', 'Nylon Spandex', 'Compression Knit']),
      group('Seam Style', ['Flatlock', 'Bonded', 'Standard']),
      group('Decoration', ['Heat Transfer', 'Sublimation', 'Screen Print']),
    ],
    specifications: [
      { label: 'Product Detail', value: 'Custom performance leggings' },
      { label: 'Branding Detail', value: 'Custom colors, logo and branded panel options' },
      { label: 'Customization Detail', value: 'Selectable length, rise, waistband, pockets and fabric' },
      { label: 'Use', value: 'Gym, fitness, training and active lifestyle collections' },
    ],
    basic: ['size', 'length', 'waist-rise'],
  }),
]

export const ensureActivewearCustomizers = async () => {
  const [categories] = await pool.execute(
    "SELECT id FROM categories WHERE slug = 'activewear' LIMIT 1"
  )

  if (!categories.length) return

  const categoryId = categories[0].id

  for (const config of validSeedRecords(activewearCustomizers, 'activewear customizer')) {
    const productSlug = slugify(config.lookupName)

    const [products] = await pool.execute(
      `SELECT id FROM products
       WHERE category_id = ? AND slug = ?
       LIMIT 1`,
      [categoryId, productSlug]
    )

    if (!products.length) continue

    const productId = products[0].id

    await pool.execute(
      `UPDATE product_customizer_items
       SET active = 0
       WHERE product_id = ?
         AND slug IN (?, ?)`,
      [productId, productSlug, slugify(config.name)]
    )

    for (let variant = 1; variant <= 3; variant += 1) {
      const variantName = `${config.name} ${variant}`
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

      await pool.execute(
        `UPDATE product_customizer_items
         SET active = 1,
             display_order = ?
         WHERE product_id = ?
           AND slug = ?`,
        [variant, productId, variantSlug]
      )
    }
  }
}
