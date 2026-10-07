import pool from './mysql.js'

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']

const STANDARD_COLORS = [
  { name: 'Black', value: '#080808' },
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#e10600' },
  { name: 'Royal Blue', value: '#0047ab' },
  { name: 'Navy', value: '#14213d' },
  { name: 'Green', value: '#00a651' },
  { name: 'Gold', value: '#f5d000' },
]

const group = (name, values) => ({
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
  values,
})

const base = ({
  product,
  item,
  description,
  sizes = STANDARD_SIZES,
  colorZones = ['Main Color', 'Secondary Color', 'Trim / Accent Color'],
  optionGroups = [],
  specifications = [],
  basic = [],
  player = true,
  logo = true,
  notes = true,
}) => ({
  product,
  item,
  description,
  sizes,
  colors: STANDARD_COLORS,
  colorZones,
  optionGroups,
  specifications,
  basic,
  required: sizes.length ? ['size', 'color'] : ['color'],
  player,
  logo,
  notes,
})

const sportsCustomizers = [
  base({
    product: 'American Football Uniform',
    item: 'American Football Uniform',
    description: 'Custom American football jersey and pants set for teams, clubs and competitive programs.',
    colorZones: ['Jersey Main Color', 'Jersey Secondary Color', 'Pants Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Jersey Size', STANDARD_SIZES),
      group('Jersey Fit', ['Standard', 'Athletic', 'Compression']),
      group('Sleeve Style', ['Cap Sleeve', 'Short Sleeve', 'Extended Sleeve']),
      group('Neck Style', ['V Neck', 'Crew Neck']),
      group('Pants Size', STANDARD_SIZES),
      group('Pants Length', ['Knee Length', 'Below Knee']),
      group('Pants Fit', ['Standard', 'Athletic']),
      group('Fabric', ['Stretch Polyester', 'Heavy Mesh', 'Performance Interlock']),
      group('Panel Style', ['Standard Panels', 'Contrast Side Panels', 'Custom Panels']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Embroidery']),
      group('Number Style', ['Block', 'Modern', 'Custom']),
      group('Number Placement', ['Front + Back', 'Front + Back + Shoulders']),
      group('Name Placement', ['Back', 'None']),
      group('Stitching', ['Reinforced', 'Flatlock']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Jersey and football pants' },
      { label: 'Use', value: 'Game and team competition' },
    ],
    basic: ['jersey-size', 'pants-size'],
  }),

  base({
    product: 'Baseball Uniform',
    item: 'Baseball Uniform',
    description: 'Custom baseball jersey and pants set with team branding, player details and performance construction.',
    colorZones: ['Jersey Main Color', 'Jersey Secondary Color', 'Pants Main Color', 'Piping / Accent Color'],
    optionGroups: [
      group('Jersey Size', STANDARD_SIZES),
      group('Jersey Style', ['Button Front', 'Two Button', 'Pullover']),
      group('Jersey Fit', ['Regular', 'Athletic']),
      group('Sleeve Length', ['Short Sleeve', '3/4 Sleeve', 'Long Sleeve']),
      group('Pants Size', STANDARD_SIZES),
      group('Pants Style', ['Open Bottom', 'Knicker']),
      group('Pants Fit', ['Regular', 'Athletic']),
      group('Piping', ['None', 'Single Piping', 'Double Piping']),
      group('Fabric', ['Polyester Interlock', 'Stretch Polyester', 'Performance Mesh']),
      group('Decoration', ['Sublimation', 'Embroidery', 'Tackle Twill', 'Heat Transfer']),
      group('Number Style', ['Classic', 'Block', 'Modern']),
      group('Belt Loop Style', ['Standard', 'Wide']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Baseball jersey and pants' },
      { label: 'Use', value: 'Club, school and competitive baseball' },
    ],
    basic: ['jersey-size', 'pants-size'],
  }),

  base({
    product: 'Basketball Uniform',
    item: 'Basketball Uniform',
    description: 'Custom basketball jersey and shorts set designed for movement, ventilation and complete team branding.',
    colorZones: ['Jersey Main Color', 'Jersey Secondary Color', 'Shorts Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Jersey Size', STANDARD_SIZES),
      group('Jersey Fit', ['Regular', 'Athletic', 'Slim']),
      group('Neck Style', ['V Neck', 'Crew Neck']),
      group('Armhole Style', ['Standard', 'Wide Performance']),
      group('Shorts Size', STANDARD_SIZES),
      group('Shorts Length', ['Above Knee', 'Knee Length', 'Long']),
      group('Shorts Fit', ['Regular', 'Athletic', 'Relaxed']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord']),
      group('Fabric', ['Bird Eye Mesh', 'Micro Mesh', 'Polyester Interlock']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Embroidery']),
      group('Number Style', ['Classic', 'Block', 'Modern']),
      group('Side Panel Style', ['Plain', 'Contrast Panel', 'Custom Panel']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Basketball jersey and shorts' },
      { label: 'Use', value: 'Match, club and academy basketball' },
    ],
    basic: ['jersey-size', 'shorts-size'],
  }),

  base({
    product: 'Cricket Uniform',
    item: 'Cricket Uniform',
    description: 'Custom cricket shirt and trouser set for clubs, academies, tournaments and team programs.',
    colorZones: ['Shirt Main Color', 'Shirt Secondary Color', 'Trouser Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Shirt Size', STANDARD_SIZES),
      group('Shirt Fit', ['Regular', 'Athletic', 'Slim']),
      group('Sleeve Length', ['Short Sleeve', 'Long Sleeve']),
      group('Collar Style', ['Polo Collar', 'Mandarin Collar', 'Crew Neck']),
      group('Trouser Size', STANDARD_SIZES),
      group('Trouser Fit', ['Regular', 'Tapered', 'Slim']),
      group('Trouser Waist', ['Elastic', 'Elastic + Drawcord']),
      group('Fabric', ['Dry Fit Polyester', 'Micro Mesh', 'Polyester Interlock']),
      group('Decoration', ['Sublimation', 'Embroidery', 'Heat Transfer']),
      group('Sponsor Placement', ['Front', 'Sleeve', 'Back', 'Multiple']),
      group('Piping Style', ['None', 'Contrast Piping', 'Panel Detail']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Cricket shirt and trousers' },
      { label: 'Use', value: 'Match and team cricket' },
    ],
    basic: ['shirt-size', 'trouser-size'],
  }),

  base({
    product: 'Ice Hockey Uniform',
    item: 'Ice Hockey Uniform',
    description: 'Custom ice hockey jersey and sock set made with room for protective equipment and bold team graphics.',
    colorZones: ['Jersey Main Color', 'Jersey Secondary Color', 'Hockey Socks Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Jersey Size', ['YS', 'YM', 'YL', ...STANDARD_SIZES]),
      group('Jersey Cut', ['Traditional Hockey', 'Athletic Hockey']),
      group('Sleeve Style', ['Standard Hockey Sleeve', 'Tapered Sleeve']),
      group('Body Length', ['Standard', 'Extended']),
      group('Hockey Socks Size', ['Youth', 'Junior', 'Senior']),
      group('Hockey Socks Style', ['Knit', 'Sublimated']),
      group('Fabric', ['Hockey Mesh', 'Heavy Polyester', 'Performance Knit']),
      group('Decoration', ['Sublimation', 'Tackle Twill', 'Embroidery']),
      group('Shoulder Style', ['Plain', 'Contrast Yoke', 'Custom Yoke']),
      group('Number Style', ['Classic Hockey', 'Block', 'Modern']),
      group('Name Bar', ['Yes', 'No']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Hockey jersey and hockey socks' },
      { label: 'Fit', value: 'Designed to fit over protective equipment' },
    ],
    basic: ['jersey-size', 'hockey-socks-size'],
  }),

  base({
    product: 'Netball Uniform',
    item: 'Netball Uniform',
    description: 'Custom netball uniform for teams, clubs and schools with coordinated colors, fit and player-position options.',
    colorZones: ['Main Color', 'Secondary Color', 'Side Panel Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Uniform Size', STANDARD_SIZES),
      group('Uniform Type', ['Dress', 'Top + Skirt', 'Top + Shorts']),
      group('Fit', ['Regular', 'Athletic', 'Fitted']),
      group('Neck Style', ['Round Neck', 'V Neck']),
      group('Length', ['Standard', 'Long']),
      group('Fabric', ['Dry Fit Polyester', 'Stretch Interlock', 'Performance Mesh']),
      group('Position Bib Style', ['Separate Bibs', 'Velcro Patches', 'Printed Position']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Embroidery']),
      group('Panel Style', ['Plain', 'Contrast Side Panel', 'Custom Panel']),
    ],
    specifications: [
      { label: 'Use', value: 'Club, school and competitive netball' },
      { label: 'Customizable', value: 'Team colors, logo and position details' },
    ],
    basic: ['uniform-size', 'uniform-type'],
  }),

  base({
    product: 'Rugby Uniform',
    item: 'Rugby Uniform',
    description: 'Custom rugby jersey and shorts set built for contact sport durability, mobility and team branding.',
    colorZones: ['Jersey Main Color', 'Jersey Secondary Color', 'Shorts Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Jersey Size', STANDARD_SIZES),
      group('Jersey Fit', ['Traditional', 'Athletic', 'Pro Fit']),
      group('Sleeve Length', ['Short Sleeve', 'Long Sleeve']),
      group('Collar Style', ['Crew Neck', 'Rugby Collar', 'V Neck']),
      group('Shorts Size', STANDARD_SIZES),
      group('Shorts Fit', ['Regular', 'Athletic']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord']),
      group('Fabric', ['Heavy Polyester', 'Stretch Polyester', 'Performance Knit']),
      group('Decoration', ['Sublimation', 'Embroidery', 'Heat Transfer']),
      group('Reinforcement', ['Standard', 'Shoulder Reinforced', 'Full Reinforced']),
      group('Panel Style', ['Plain', 'Contrast Panel', 'Custom Panel']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Rugby jersey and shorts' },
      { label: 'Use', value: 'Training and competitive rugby' },
    ],
    basic: ['jersey-size', 'shorts-size'],
  }),

  base({
    product: 'Volleyball Uniform',
    item: 'Volleyball Uniform',
    description: 'Custom volleyball jersey and shorts set designed for lightweight performance and unrestricted movement.',
    colorZones: ['Jersey Main Color', 'Jersey Secondary Color', 'Shorts Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Jersey Size', STANDARD_SIZES),
      group('Jersey Fit', ['Regular', 'Athletic', 'Fitted']),
      group('Sleeve Style', ['Sleeveless', 'Short Sleeve', 'Long Sleeve']),
      group('Neck Style', ['V Neck', 'Crew Neck']),
      group('Shorts Size', STANDARD_SIZES),
      group('Shorts Style', ['Standard Shorts', 'Compression Shorts', 'Women\'s Volleyball Shorts']),
      group('Shorts Fit', ['Regular', 'Athletic', 'Compression']),
      group('Fabric', ['Dry Fit Polyester', 'Micro Mesh', 'Stretch Interlock']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Embroidery']),
      group('Number Style', ['Classic', 'Block', 'Modern']),
      group('Panel Style', ['Plain', 'Contrast Panel', 'Custom Panel']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Volleyball jersey and shorts' },
      { label: 'Use', value: 'Club, school and competitive volleyball' },
    ],
    basic: ['jersey-size', 'shorts-size'],
  }),

  base({
    product: 'Softball Uniform',
    item: 'Softball Uniform',
    description: 'Custom softball jersey and pants or shorts set for competitive teams, clubs and school programs.',
    colorZones: ['Jersey Main Color', 'Jersey Secondary Color', 'Bottom Main Color', 'Piping / Accent Color'],
    optionGroups: [
      group('Jersey Size', STANDARD_SIZES),
      group('Jersey Style', ['Button Front', 'Two Button', 'Pullover']),
      group('Jersey Fit', ['Regular', 'Athletic', 'Women\'s Fit']),
      group('Sleeve Length', ['Short Sleeve', '3/4 Sleeve', 'Long Sleeve']),
      group('Bottom Size', STANDARD_SIZES),
      group('Bottom Style', ['Pants', 'Knicker Pants', 'Shorts']),
      group('Bottom Fit', ['Regular', 'Athletic']),
      group('Piping', ['None', 'Single Piping', 'Double Piping']),
      group('Fabric', ['Stretch Polyester', 'Polyester Interlock', 'Performance Mesh']),
      group('Decoration', ['Sublimation', 'Embroidery', 'Heat Transfer']),
      group('Number Style', ['Classic', 'Block', 'Modern']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Softball jersey and selected bottom' },
      { label: 'Use', value: 'Competitive and team softball' },
    ],
    basic: ['jersey-size', 'bottom-size', 'bottom-style'],
  }),

  base({
    product: 'Cheerleaders Uniform',
    item: 'Cheerleaders Uniform',
    description: 'Custom cheerleading uniform set designed for coordinated team presentation, movement and performance.',
    colorZones: ['Top Main Color', 'Top Secondary Color', 'Bottom Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Top Size', STANDARD_SIZES),
      group('Top Style', ['Sleeveless Shell', 'Short Sleeve', 'Long Sleeve']),
      group('Top Fit', ['Regular', 'Fitted']),
      group('Neck Style', ['V Neck', 'Crew Neck', 'Mock Neck']),
      group('Bottom Size', STANDARD_SIZES),
      group('Bottom Style', ['Pleated Skirt', 'Straight Skirt', 'Shorts']),
      group('Skirt Length', ['Standard', 'Long']),
      group('Fabric', ['Stretch Polyester', 'Performance Knit', 'Poly Spandex']),
      group('Decoration', ['Sublimation', 'Embroidery', 'Heat Transfer']),
      group('Trim Style', ['Plain', 'Striped', 'Metallic Accent', 'Custom']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Cheer top and selected bottom' },
      { label: 'Use', value: 'Cheer teams and performance squads' },
    ],
    basic: ['top-size', 'bottom-size', 'bottom-style'],
  }),

  base({
    product: 'Lacrosse Uniform',
    item: 'Lacrosse Uniform',
    description: 'Custom lacrosse jersey and shorts set for clubs, schools and competitive teams.',
    colorZones: ['Jersey Main Color', 'Jersey Secondary Color', 'Shorts Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Jersey Size', STANDARD_SIZES),
      group('Jersey Style', ['Sleeveless', 'Short Sleeve']),
      group('Jersey Fit', ['Regular', 'Athletic', 'Loose Equipment Fit']),
      group('Neck Style', ['V Neck', 'Crew Neck']),
      group('Shorts Size', STANDARD_SIZES),
      group('Shorts Length', ['Standard', 'Long']),
      group('Shorts Fit', ['Regular', 'Athletic']),
      group('Fabric', ['Performance Mesh', 'Polyester Interlock', 'Micro Mesh']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Embroidery']),
      group('Number Style', ['Classic', 'Block', 'Modern']),
      group('Panel Style', ['Plain', 'Contrast Panel', 'Custom Panel']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Lacrosse jersey and shorts' },
      { label: 'Use', value: 'Field lacrosse teamwear' },
    ],
    basic: ['jersey-size', 'shorts-size'],
  }),

  base({
    product: 'Swimming Suits',
    item: 'Swimming Suit',
    description: 'Custom performance swimwear for clubs, training programs and competitive teams.',
    sizes: ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL'],
    colorZones: ['Main Color', 'Secondary Color', 'Side / Panel Color', 'Trim / Strap Color'],
    optionGroups: [
      group('Swimwear Type', ['One Piece', 'Racing Suit', 'Jammer', 'Swim Brief', 'Rash Guard']),
      group('Size', ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL']),
      group('Fit', ['Training Fit', 'Performance Fit', 'Compression Fit']),
      group('Back Style', ['Racerback', 'Crossback', 'Open Back', 'Not Applicable']),
      group('Leg Cut', ['Standard', 'High Cut', 'Knee Length', 'Not Applicable']),
      group('Fabric', ['Chlorine Resistant Polyester', 'Poly Spandex', 'Compression Swim Fabric']),
      group('Lining', ['Front Lined', 'Fully Lined', 'Unlined']),
      group('Decoration', ['Sublimation', 'Heat Transfer', 'Screen Print']),
    ],
    specifications: [
      { label: 'Use', value: 'Training and competitive swimming' },
      { label: 'Customizable', value: 'Colors, club branding and fit options' },
    ],
    basic: ['swimwear-type', 'size'],
    player: false,
  }),

  base({
    product: 'Polo T-Shirts',
    item: 'Polo T-Shirt',
    description: 'Custom polo shirts for teams, clubs, staff uniforms and branded sportswear programs.',
    colorZones: ['Body Main Color', 'Collar Color', 'Sleeve / Cuff Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Size', STANDARD_SIZES),
      group('Fit', ['Regular', 'Athletic', 'Slim']),
      group('Sleeve Length', ['Short Sleeve', 'Long Sleeve']),
      group('Collar Style', ['Classic Polo', 'Mandarin Polo', 'Contrast Collar']),
      group('Placket', ['2 Button', '3 Button', 'Hidden Placket']),
      group('Fabric', ['Polyester Pique', 'Cotton Pique', 'Poly Cotton', 'Dry Fit']),
      group('Cuff Style', ['Plain', 'Rib Cuff', 'Contrast Cuff']),
      group('Decoration', ['Embroidery', 'Heat Transfer', 'Screen Print', 'Sublimation']),
      group('Logo Placement', ['Left Chest', 'Right Chest', 'Sleeve', 'Back']),
    ],
    specifications: [
      { label: 'Use', value: 'Teams, clubs, staff and branded uniforms' },
      { label: 'Product', value: 'Custom polo shirt' },
    ],
    basic: ['size', 'fit'],
    player: false,
  }),

  base({
    product: 'Training Suits / Tracksuits',
    item: 'Training Suit / Tracksuit',
    description: 'Custom coordinated training jacket and pants set for warm-ups, travel and complete team presentation.',
    colorZones: ['Jacket Main Color', 'Jacket Secondary Color', 'Pants Main Color', 'Trim / Accent Color'],
    optionGroups: [
      group('Jacket Size', STANDARD_SIZES),
      group('Jacket Fit', ['Regular', 'Athletic', 'Slim']),
      group('Jacket Style', ['Full Zip', 'Half Zip', 'Pullover']),
      group('Collar Style', ['Stand Collar', 'Hooded', 'Crew Neck']),
      group('Pants Size', STANDARD_SIZES),
      group('Pants Fit', ['Regular', 'Tapered', 'Slim']),
      group('Pant Cuff', ['Open Hem', 'Elastic Cuff', 'Zip Cuff']),
      group('Waistband', ['Elastic', 'Elastic + Drawcord']),
      group('Fabric', ['Tricot Polyester', 'Interlock', 'Microfiber', 'Fleece']),
      group('Lining', ['Unlined', 'Mesh Lined', 'Fleece Lined']),
      group('Decoration', ['Embroidery', 'Heat Transfer', 'Sublimation', 'Screen Print']),
      group('Pocket Style', ['No Pocket', 'Side Pocket', 'Zip Pocket']),
    ],
    specifications: [
      { label: 'Set Includes', value: 'Training jacket and pants' },
      { label: 'Use', value: 'Warm-up, travel and training' },
    ],
    basic: ['jacket-size', 'pants-size'],
    player: false,
  }),
]

const slugify = (value = '') =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export const ensureSportsCustomizers = async () => {
  const [categories] = await pool.execute(
    "SELECT id FROM categories WHERE slug = 'sportswear' LIMIT 1"
  )

  if (!categories.length) return

  const categoryId = categories[0].id

  for (let index = 0; index < sportsCustomizers.length; index += 1) {
    const config = sportsCustomizers[index]
    const productSlug = slugify(config.product)

    const [products] = await pool.execute(
      `SELECT id FROM products
       WHERE category_id = ? AND slug = ?
       LIMIT 1`,
      [categoryId, productSlug]
    )

    if (!products.length) continue

    const productId = products[0].id
    const itemSlug = slugify(config.item)

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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)`,
      [
        productId,
        config.item,
        itemSlug,
        config.description,
        JSON.stringify(config.sizes),
        JSON.stringify(config.colors),
        JSON.stringify(config.colorZones),
        JSON.stringify(config.optionGroups),
        JSON.stringify(config.specifications),
        JSON.stringify({}),
        JSON.stringify(config.basic),
        JSON.stringify(config.required),
        'custom',
        JSON.stringify({}),
        1,
        config.logo ? 1 : 0,
        config.player ? 1 : 0,
        config.player ? 1 : 0,
        config.notes ? 1 : 0,
      ]
    )
  }
}
