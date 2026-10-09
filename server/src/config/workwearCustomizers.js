import pool from './mysql.js'

const STANDARD_SIZES = ['XS','S','M','L','XL','2XL','3XL','4XL']
const COLORS = [
  { name:'Black', value:'#080808' },
  { name:'White', value:'#ffffff' },
  { name:'Navy', value:'#14213d' },
  { name:'Charcoal', value:'#34383d' },
  { name:'Royal Blue', value:'#0047ab' },
  { name:'Red', value:'#e10600' },
  { name:'Khaki', value:'#b6a27a' },
  { name:'Safety Yellow', value:'#d7ff00' },
]

const slugify = (value='') => value.toString().toLowerCase().trim()
  .replace(/['’]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')

const group = (name, values) => ({ name, slug: slugify(name), values })

const products = [
  {
    name:'Suits',
    description:'Custom professional suits for corporate teams, staff uniforms and coordinated workwear programs.',
    zones:['Jacket Main Color','Trouser Main Color','Lapel / Trim Color'],
    groups:[
      group('Size', STANDARD_SIZES),
      group('Fit',['Regular','Tailored','Slim']),
      group('Jacket Style',['Single Breasted','Double Breasted']),
      group('Lapel Style',['Notch','Peak','Shawl']),
      group('Trouser Fit',['Regular','Straight','Slim']),
      group('Fabric',['Poly Viscose','Wool Blend','Stretch Suiting']),
      group('Lining',['Half Lined','Full Lined']),
      group('Branding',['Embroidery','Woven Label','No Visible Branding']),
    ],
    basic:['size','fit'],
    specs:[
      {label:'Product Detail',value:'Custom professional suit set'},
      {label:'Branding Detail',value:'Custom colors, labels and corporate branding options'},
      {label:'Customization Detail',value:'Selectable fit, lapel, fabric, lining and trouser options'},
      {label:'Use',value:'Corporate teams, staff uniforms and formal workwear'},
    ],
  },
  {
    name:'Jackets',
    description:'Custom work jackets built for professional use with durable fabrics and company branding options.',
    zones:['Body Main Color','Sleeve / Panel Color','Trim / Accent Color'],
    groups:[
      group('Size', STANDARD_SIZES),
      group('Fit',['Regular','Relaxed','Athletic']),
      group('Jacket Style',['Work Jacket','Utility Jacket','Soft Work Jacket']),
      group('Closure',['Full Zip','Snap Front','Zip + Storm Flap']),
      group('Collar Style',['Stand Collar','Turn Down Collar']),
      group('Fabric',['Cotton Twill','Poly Cotton','Canvas','Softshell']),
      group('Lining',['Unlined','Mesh Lined','Fleece Lined']),
      group('Pocket Style',['Side Pocket','Chest Pocket','Utility Pocket']),
      group('Branding',['Embroidery','Heat Transfer','Patch']),
    ],
    basic:['size','fit'],
    specs:[
      {label:'Product Detail',value:'Durable custom professional work jacket'},
      {label:'Branding Detail',value:'Custom company colors, logo and branded patches'},
      {label:'Customization Detail',value:'Selectable fit, fabric, closure, lining and pocket options'},
      {label:'Use',value:'Companies, staff teams and professional workwear programs'},
    ],
  },
  {
    name:'Pants',
    description:'Professional custom work pants designed for everyday comfort, durability and uniform consistency.',
    zones:['Main Color','Pocket / Panel Color','Trim / Accent Color'],
    groups:[
      group('Size', STANDARD_SIZES),
      group('Fit',['Regular','Relaxed','Straight','Tapered']),
      group('Waistband',['Fixed Waist','Elastic Back','Elastic + Drawcord']),
      group('Leg Style',['Straight','Tapered']),
      group('Fabric',['Cotton Twill','Poly Cotton','Stretch Twill','Ripstop']),
      group('Pocket Style',['Side Pocket','Cargo Pocket','Utility Pocket']),
      group('Hem Style',['Open Hem','Elastic Cuff']),
      group('Branding',['Embroidery','Heat Transfer','Woven Label']),
    ],
    basic:['size','fit'],
    specs:[
      {label:'Product Detail',value:'Custom professional work pants'},
      {label:'Branding Detail',value:'Custom colors, logo and company uniform branding'},
      {label:'Customization Detail',value:'Selectable fit, waistband, fabric, pockets and hem'},
      {label:'Use',value:'Daily workwear, staff uniforms and company apparel programs'},
    ],
  },
  {
    name:'Safety Jacket',
    variantCount:1,
    description:'Custom high-visibility safety jacket built for professional work crews, industrial use and branded PPE programs.',
    zones:['Main High-Visibility Color','Contrast Panel Color','Reflective Trim / Accent Color'],
    groups:[
      group('Size', STANDARD_SIZES),
      group('Fit',['Regular','Relaxed']),
      group('Shell Material',['Polyester Oxford','PU Coated Polyester','Softshell']),
      group('Visibility Color',['Safety Yellow','Safety Orange']),
      group('Reflective Tape',['Standard Silver','Segmented Reflective','High-Visibility Reflective']),
      group('Closure',['Full Zip','Zip + Storm Flap']),
      group('Sleeve Style',['Long Sleeve','Detachable Sleeve']),
      group('Pocket Style',['Side Pockets','Chest + Side Pockets','Utility Pockets']),
      group('Lining',['Unlined','Mesh Lined','Quilted']),
      group('Branding',['Embroidery','Heat Transfer','Screen Print']),
    ],
    basic:['size','fit'],
    specs:[
      {label:'Product Detail',value:'Custom high-visibility safety jacket'},
      {label:'Branding Detail',value:'Custom company logo, colors and branded safety detailing'},
      {label:'Customization Detail',value:'Selectable shell, reflective tape, closure, pockets and lining'},
      {label:'Use',value:'Construction, logistics, industrial teams and professional workwear'},
    ],
  },
  {
    name:'Safety Vest',
    variantCount:1,
    description:'Custom high-visibility safety vest designed for work crews, logistics, events and branded safety programs.',
    zones:['Main High-Visibility Color','Reflective Trim Color','Binding / Accent Color'],
    groups:[
      group('Size', STANDARD_SIZES),
      group('Fit',['Regular','Relaxed']),
      group('Vest Style',['Basic Safety Vest','Executive Safety Vest','Utility Safety Vest']),
      group('Visibility Color',['Safety Yellow','Safety Orange']),
      group('Reflective Tape',['Standard Silver','Segmented Reflective','High-Visibility Reflective']),
      group('Closure',['Zip Front','Velcro Front']),
      group('Pocket Style',['No Pocket','Chest Pocket','Multi Pocket']),
      group('Fabric',['Mesh Polyester','Solid Polyester','Oxford Polyester']),
      group('Branding',['Heat Transfer','Screen Print','Embroidery']),
    ],
    basic:['size','vest-style'],
    specs:[
      {label:'Product Detail',value:'Custom high-visibility safety vest'},
      {label:'Branding Detail',value:'Custom company logo, colors and branded reflective detailing'},
      {label:'Customization Detail',value:'Selectable vest style, reflective tape, closure, pockets and fabric'},
      {label:'Use',value:'Construction, logistics, events and professional safety programs'},
    ],
  }
]

export const ensureWorkwearCustomizers = async () => {
  const [cats] = await pool.execute("SELECT id FROM categories WHERE slug='workwear' LIMIT 1")
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

    const variantCount = Number(config.variantCount || 3)

    for (let variant=1; variant<=variantCount; variant+=1) {
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
          productId, variantName, variantSlug, `${config.description} Design ${variant}.`,
          JSON.stringify(STANDARD_SIZES), JSON.stringify(COLORS), JSON.stringify(config.zones),
          JSON.stringify(config.groups), JSON.stringify([...config.specs,{label:'Design',value:`Design ${variant}`}]),
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
