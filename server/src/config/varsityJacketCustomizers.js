import pool from './mysql.js'
import { validSeedRecords } from '../utils/seedValidation.js'

const STANDARD_SIZES = ['XS','S','M','L','XL','2XL','3XL','4XL']
const COLORS = [
  { name:'Black', value:'#080808' },
  { name:'White', value:'#ffffff' },
  { name:'Navy', value:'#14213d' },
  { name:'Red', value:'#e10600' },
  { name:'Royal Blue', value:'#0047ab' },
  { name:'Forest Green', value:'#1f5d42' },
  { name:'Burgundy', value:'#7b1e2b' },
  { name:'Cream', value:'#eee3cc' },
]

const slugify = (value='') => value.toString().toLowerCase().trim()
  .replace(/['’]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')

const group = (name, values) => ({ name, slug: slugify(name), values })

const products = [
  {
    name:'Wool-Leather',
    description:'Custom wool-leather varsity jacket with premium materials, coordinated trims and brand-ready decoration.',
    zones:['Body Main Color','Sleeve Color','Rib / Trim Color','Accent Color'],
    groups:[
      group('Size',STANDARD_SIZES),
      group('Fit',['Regular','Relaxed','Oversized','Slim']),
      group('Body Material',['Melton Wool','Premium Wool Blend']),
      group('Sleeve Material',['Genuine Leather','PU Leather','Synthetic Leather']),
      group('Closure',['Snap Buttons','Zip Front']),
      group('Collar Style',['Varsity Rib Collar','Stand Collar']),
      group('Pocket Style',['Welt Pocket','Leather Trim Pocket','Zip Pocket']),
      group('Rib Style',['Solid Rib','Striped Rib','Custom Rib']),
      group('Lining',['Polyester Lining','Quilted Lining','Satin Lining']),
      group('Decoration',['Embroidery','Chenille Patch','Leather Patch','Screen Print']),
    ],
    specs:[
      {label:'Product Detail',value:'Premium wool body with leather sleeves'},
      {label:'Branding Detail',value:'Custom colors, patches, embroidery and branding options'},
      {label:'Customization Detail',value:'Selectable wool, leather, lining, ribbing and fit options'},
      {label:'Use',value:'Schools, clubs, teams and premium streetwear collections'},
    ],
  },
  {
    name:'Satin',
    description:'Lightweight custom satin jacket with a smooth finish, coordinated trims and flexible branding options.',
    zones:['Body Main Color','Sleeve Color','Rib / Trim Color','Accent Color'],
    groups:[
      group('Size',STANDARD_SIZES),
      group('Fit',['Regular','Relaxed','Oversized','Slim']),
      group('Satin Finish',['Matte Satin','Classic Shine','High Shine']),
      group('Closure',['Snap Buttons','Zip Front']),
      group('Collar Style',['Varsity Rib Collar','Stand Collar']),
      group('Pocket Style',['Welt Pocket','Side Pocket','Zip Pocket']),
      group('Rib Style',['Solid Rib','Striped Rib','Custom Rib']),
      group('Lining',['Polyester Lining','Satin Lining','Quilted Lining']),
      group('Decoration',['Embroidery','Screen Print','Heat Transfer','Patch']),
    ],
    specs:[
      {label:'Product Detail',value:'Lightweight custom satin jacket'},
      {label:'Branding Detail',value:'Custom colors, embroidery, patches and branded detailing'},
      {label:'Customization Detail',value:'Selectable finish, ribbing, lining, fit and closure options'},
      {label:'Use',value:'Fashion, teams, lifestyle and private-label collections'},
    ],
  },
  {
    name:'Cotton Fleece',
    description:'Comfortable cotton fleece jacket designed for casual outerwear, clubs and branded apparel collections.',
    zones:['Body Main Color','Sleeve Color','Rib / Trim Color','Accent Color'],
    groups:[
      group('Size',STANDARD_SIZES),
      group('Fit',['Regular','Relaxed','Oversized','Slim']),
      group('Fabric',['Cotton Fleece','Poly Cotton Fleece','Heavy Fleece']),
      group('Fabric Weight',['Midweight','Heavyweight']),
      group('Closure',['Snap Buttons','Zip Front']),
      group('Collar Style',['Varsity Rib Collar','Stand Collar','Hooded']),
      group('Pocket Style',['Welt Pocket','Side Pocket','Kangaroo Pocket']),
      group('Rib Style',['Solid Rib','Striped Rib','Custom Rib']),
      group('Lining',['Unlined','Jersey Lined','Quilted Lining']),
      group('Decoration',['Embroidery','Screen Print','Heat Transfer','Patch']),
    ],
    specs:[
      {label:'Product Detail',value:'Soft custom cotton fleece jacket'},
      {label:'Branding Detail',value:'Custom colors, embroidery, patches and logo options'},
      {label:'Customization Detail',value:'Selectable fleece weight, fit, ribbing, pockets and finishing'},
      {label:'Use',value:'Clubs, casual outerwear and branded apparel programs'},
    ],
  },
  {
    name:'Bomper Jacket',
    description:'Custom bomber-style jacket with flexible materials, trims, lining and branding for streetwear and team collections.',
    zones:['Body Main Color','Sleeve Color','Rib / Trim Color','Accent Color'],
    groups:[
      group('Size',STANDARD_SIZES),
      group('Fit',['Regular','Relaxed','Oversized','Slim']),
      group('Outer Material',['Nylon','Polyester','Satin','Cotton Twill']),
      group('Closure',['Zip Front','Snap Buttons']),
      group('Collar Style',['Bomber Rib Collar','Stand Collar']),
      group('Pocket Style',['Side Pocket','Zip Pocket','Utility Pocket']),
      group('Rib Style',['Solid Rib','Striped Rib','Custom Rib']),
      group('Lining',['Polyester Lining','Quilted Lining','Fleece Lining']),
      group('Padding',['No Padding','Light Padding','Warm Padding']),
      group('Decoration',['Embroidery','Screen Print','Heat Transfer','Patch']),
    ],
    specs:[
      {label:'Product Detail',value:'Custom bomber-style jacket'},
      {label:'Branding Detail',value:'Custom colors, logo, patches and branded ribbing'},
      {label:'Customization Detail',value:'Selectable shell, lining, padding, fit and pocket options'},
      {label:'Use',value:'Streetwear, teams and lifestyle collections'},
    ],
  },
  {
    name:'Puffer Jacket',
    description:'Insulated custom puffer jacket built for colder conditions with configurable shell, quilting and branding options.',
    zones:['Shell Main Color','Panel / Yoke Color','Lining Color','Trim / Accent Color'],
    groups:[
      group('Size',STANDARD_SIZES),
      group('Fit',['Regular','Relaxed','Slim']),
      group('Shell Material',['Nylon','Polyester','Water-Resistant Polyester']),
      group('Quilt Pattern',['Horizontal','Diamond','Box Quilt']),
      group('Insulation',['Lightweight','Medium Warmth','Heavy Warmth']),
      group('Hood Style',['No Hood','Fixed Hood','Detachable Hood']),
      group('Closure',['Zip Front','Zip + Storm Flap']),
      group('Pocket Style',['Side Pocket','Zip Pocket','Inside Pocket']),
      group('Hem Style',['Straight Hem','Elastic Hem','Adjustable Hem']),
      group('Decoration',['Embroidery','Heat Transfer','Patch']),
    ],
    specs:[
      {label:'Product Detail',value:'Insulated custom puffer jacket'},
      {label:'Branding Detail',value:'Custom shell colors, logo and branded trim options'},
      {label:'Customization Detail',value:'Selectable insulation, quilting, hood, pockets and fit'},
      {label:'Use',value:'Winter collections, outdoor use and branded outerwear'},
    ],
  },
  {
    name:'Softshell Jacket',
    description:'Versatile custom softshell jacket combining lightweight weather protection, comfort and professional branding.',
    zones:['Body Main Color','Side Panel Color','Zipper / Trim Color','Accent Color'],
    groups:[
      group('Size',STANDARD_SIZES),
      group('Fit',['Regular','Athletic','Slim']),
      group('Softshell Weight',['Lightweight','Midweight','Heavyweight']),
      group('Weather Finish',['Standard','Water Resistant','Wind Resistant']),
      group('Hood Style',['No Hood','Fixed Hood','Detachable Hood']),
      group('Closure',['Full Zip','Half Zip']),
      group('Collar Style',['Stand Collar','High Collar']),
      group('Pocket Style',['Side Zip Pocket','Chest Pocket','Inside Pocket']),
      group('Hem Style',['Straight Hem','Adjustable Drawcord']),
      group('Decoration',['Embroidery','Heat Transfer','Patch']),
    ],
    specs:[
      {label:'Product Detail',value:'Custom lightweight softshell jacket'},
      {label:'Branding Detail',value:'Custom colors, logo and professional branding options'},
      {label:'Customization Detail',value:'Selectable weight, weather finish, hood, fit and pockets'},
      {label:'Use',value:'Teams, businesses, outdoor and professional collections'},
    ],
  },
]

export const ensureVarsityJacketCustomizers = async () => {
  const [cats] = await pool.execute("SELECT id FROM categories WHERE slug='varsity-jackets' LIMIT 1")
  if (!cats.length) return
  const categoryId = cats[0].id

  for (const config of validSeedRecords(products, 'varsity jacket customizer')) {
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
          `${config.description} Design ${variant}.`,
          JSON.stringify(STANDARD_SIZES), JSON.stringify(COLORS), JSON.stringify(config.zones),
          JSON.stringify(config.groups),
          JSON.stringify([...config.specs,{label:'Design',value:`Design ${variant}`}]),
          JSON.stringify({}), JSON.stringify(['size','fit']), JSON.stringify(['size','color']),
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
