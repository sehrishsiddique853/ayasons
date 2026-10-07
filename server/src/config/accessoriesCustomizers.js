import pool from './mysql.js'

const STANDARD_COLORS = [
  { name:'Black', value:'#080808' },
  { name:'White', value:'#ffffff' },
  { name:'Navy', value:'#14213d' },
  { name:'Charcoal', value:'#34383d' },
  { name:'Royal Blue', value:'#0047ab' },
  { name:'Red', value:'#e10600' },
  { name:'Forest Green', value:'#1f5d42' },
  { name:'Khaki', value:'#b6a27a' },
]

const slugify = (value='') => value.toString().toLowerCase().trim()
  .replace(/['’]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')

const group = (name, values) => ({ name, slug: slugify(name), values })

const products = [
  {
    name:'Kit Bags',
    sizes:['Small','Medium','Large','XL'],
    zones:['Body Main Color','Panel Color','Handle / Strap Color','Trim / Accent Color'],
    groups:[
      group('Size',['Small','Medium','Large','XL']),
      group('Bag Style',['Team Kit Bag','Holdall','Shoe Compartment Kit Bag']),
      group('Material',['600D Polyester','900D Polyester','Ripstop Nylon']),
      group('Closure',['Main Zip','Dual Zip']),
      group('Strap Style',['Carry Handles','Shoulder Strap','Handles + Shoulder Strap']),
      group('Compartments',['Single Main','Main + Shoe','Multi Compartment']),
      group('Base',['Standard','Reinforced','Water Resistant']),
      group('Branding',['Embroidery','Screen Print','Heat Transfer','Rubber Patch']),
    ],
    specs:[
      {label:'Product Detail',value:'Custom team kit bag'},
      {label:'Branding Detail',value:'Custom colors, logo and branded panel options'},
      {label:'Customization Detail',value:'Selectable size, material, compartments, straps and base construction'},
      {label:'Use',value:'Sports teams, clubs, training and travel'},
    ],
    basic:['size','bag-style'],
  },
  {
    name:'Duffle Bags',
    sizes:['Small','Medium','Large','XL'],
    zones:['Body Main Color','Side Panel Color','Handle / Strap Color','Trim / Accent Color'],
    groups:[
      group('Size',['Small','Medium','Large','XL']),
      group('Duffle Style',['Classic Duffle','Gym Duffle','Travel Duffle']),
      group('Material',['600D Polyester','900D Polyester','Canvas','Ripstop Nylon']),
      group('Closure',['U Zip','Straight Zip','Dual Zip']),
      group('Strap Style',['Carry Handles','Shoulder Strap','Handles + Shoulder Strap']),
      group('Compartments',['Single Main','Shoe Compartment','Multi Compartment']),
      group('Base',['Standard','Reinforced','Water Resistant']),
      group('Branding',['Embroidery','Screen Print','Heat Transfer','Rubber Patch']),
    ],
    specs:[
      {label:'Product Detail',value:'Custom duffle bag'},
      {label:'Branding Detail',value:'Custom colors, logo and private-label branding'},
      {label:'Customization Detail',value:'Selectable size, shell material, compartments, straps and closure'},
      {label:'Use',value:'Gym, travel, teams and branded merchandise'},
    ],
    basic:['size','duffle-style'],
  },
  {
    name:'Back Packs',
    sizes:['Small','Medium','Large'],
    zones:['Body Main Color','Front Panel Color','Strap Color','Trim / Accent Color'],
    groups:[
      group('Size',['Small','Medium','Large']),
      group('Backpack Style',['Day Pack','Team Backpack','Laptop Backpack']),
      group('Material',['600D Polyester','900D Polyester','Ripstop Nylon']),
      group('Main Compartment',['Standard','Laptop Sleeve','Dual Compartment']),
      group('Front Storage',['Front Pocket','Organizer Pocket','No Front Pocket']),
      group('Side Pockets',['None','Mesh Bottle Pockets','Zip Side Pockets']),
      group('Straps',['Standard Padded','Ergonomic Padded']),
      group('Branding',['Embroidery','Screen Print','Heat Transfer','Rubber Patch']),
    ],
    specs:[
      {label:'Product Detail',value:'Custom branded backpack'},
      {label:'Branding Detail',value:'Custom colors, logo and private-label detailing'},
      {label:'Customization Detail',value:'Selectable size, storage, straps, material and pocket layout'},
      {label:'Use',value:'Teams, schools, travel and daily use'},
    ],
    basic:['size','backpack-style'],
  },
  {
    name:'Socks',
    sizes:['Youth','S/M','L/XL'],
    zones:['Main Color','Heel / Toe Color','Cuff Color','Trim / Accent Color'],
    groups:[
      group('Size',['Youth','S/M','L/XL']),
      group('Sock Style',['Crew','Knee High','Ankle']),
      group('Fabric',['Polyester Blend','Cotton Blend','Performance Nylon Blend']),
      group('Cushioning',['Light','Medium','Full Cushion']),
      group('Compression',['Standard','Arch Support','Performance Compression']),
      group('Cuff Style',['Plain','Ribbed','Striped']),
      group('Branding',['Knitted Logo','Sublimated','Embroidered Detail']),
    ],
    specs:[
      {label:'Product Detail',value:'Custom sports and lifestyle socks'},
      {label:'Branding Detail',value:'Custom colors, knitted logo and coordinated brand details'},
      {label:'Customization Detail',value:'Selectable length, fabric, cushioning, cuff and compression'},
      {label:'Use',value:'Sports teams, lifestyle collections and merchandise'},
    ],
    basic:['size','sock-style'],
  },
]

export const ensureAccessoriesCustomizers = async () => {
  const [cats] = await pool.execute("SELECT id FROM categories WHERE slug='accessories' LIMIT 1")
  if (!cats.length) return
  const categoryId = cats[0].id

  for (const config of products) {
    const productSlug = slugify(config.name)
    const [rows] = await pool.execute(
      'SELECT id FROM products WHERE category_id=? AND slug=? LIMIT 1',
      [categoryId, productSlug]
    )
    if (!rows.length) continue
    const productId = rows[0].id

    await pool.execute(
      'UPDATE product_customizer_items SET active=0 WHERE product_id=? AND slug=?',
      [productId, productSlug]
    )

    for (let variant=1; variant<=3; variant+=1) {
      const variantName = `${config.name} ${variant}`
      const variantSlug = slugify(variantName)

      await pool.execute(
        `INSERT IGNORE INTO product_customizer_items (
          product_id,name,slug,description,sizes_json,colors_json,color_zones_json,
          option_groups_json,specifications_json,default_options_json,basic_option_slugs_json,
          required_fields_json,default_color_mode,preset_colors_json,allow_custom_color,
          allow_logo_upload,allow_player_name,allow_player_number,allow_custom_notes,active,display_order
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,1,0,0,1,1,?)`,
        [
          productId, variantName, variantSlug,
          `Custom ${config.name.toLowerCase()} design ${variant} with editable colors, construction and branding.`,
          JSON.stringify(config.sizes), JSON.stringify(STANDARD_COLORS), JSON.stringify(config.zones),
          JSON.stringify(config.groups),
          JSON.stringify([...config.specs,{label:'Design',value:`Design ${variant}`}]),
          JSON.stringify({}), JSON.stringify(config.basic), JSON.stringify(['size','color']),
          'custom', JSON.stringify({}), variant
        ]
      )

      await pool.execute(
        'UPDATE product_customizer_items SET active=1, display_order=? WHERE product_id=? AND slug=?',
        [variant, productId, variantSlug]
      )
    }
  }
}
