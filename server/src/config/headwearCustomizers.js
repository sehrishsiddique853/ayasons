import pool from './mysql.js'
import { validSeedRecords } from '../utils/seedValidation.js'

const COLORS = [
  { name:'Black', value:'#080808' },
  { name:'White', value:'#ffffff' },
  { name:'Navy', value:'#14213d' },
  { name:'Red', value:'#e10600' },
  { name:'Royal Blue', value:'#0047ab' },
  { name:'Forest Green', value:'#1f5d42' },
  { name:'Khaki', value:'#b6a27a' },
  { name:'Grey', value:'#73777b' },
]

const slugify = (value='') => value.toString().toLowerCase().trim()
  .replace(/['’]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')

const group = (name, values) => ({ name, slug: slugify(name), values })

const products = [
  {
    name:'Beanies',
    sizes:['One Size','S/M','L/XL'],
    zones:['Main Knit Color','Cuff Color','Pom / Trim Color'],
    groups:[
      group('Size',['One Size','S/M','L/XL']),
      group('Beanie Style',['Cuffed','Uncuffed','Slouch','Pom Beanie']),
      group('Knit Style',['Plain Knit','Rib Knit','Cable Knit']),
      group('Material',['Acrylic','Cotton Blend','Wool Blend']),
      group('Branding',['Embroidery','Woven Patch','Leather Patch']),
    ],
    specs:['Custom knitted beanie','Cold-weather, team and merchandise collections'],
  },
  {
    name:'Bucket Hat',
    sizes:['S/M','L/XL'],
    zones:['Crown Main Color','Brim Color','Trim / Accent Color'],
    groups:[
      group('Size',['S/M','L/XL']),
      group('Brim Style',['Standard','Wide Brim','Short Brim']),
      group('Fabric',['Cotton Twill','Canvas','Nylon']),
      group('Ventilation',['Eyelets','Mesh Panel','None']),
      group('Branding',['Embroidery','Woven Patch','Heat Transfer']),
    ],
    specs:['Custom bucket hat','Lifestyle, streetwear and promotional collections'],
  },
  {
    name:'Trucker Hat',
    sizes:['One Size'],
    zones:['Front Panel Color','Mesh Color','Brim Color','Trim / Accent Color'],
    groups:[
      group('Size',['One Size']),
      group('Profile',['Low','Mid','High']),
      group('Front Panel',['Foam','Cotton Twill','Polyester']),
      group('Mesh',['Standard Mesh','Premium Mesh']),
      group('Closure',['Snapback','Adjustable Strap']),
      group('Brim',['Flat','Curved']),
      group('Branding',['Embroidery','Patch','Heat Transfer']),
    ],
    specs:['Custom trucker hat','Teams, promotions and merchandise collections'],
  },
  {
    name:'Baseball Cap',
    sizes:['One Size','S/M','L/XL'],
    zones:['Crown Main Color','Brim Color','Button / Eyelet Color','Trim / Accent Color'],
    groups:[
      group('Size',['One Size','S/M','L/XL']),
      group('Profile',['Low','Mid','High']),
      group('Structure',['Structured','Unstructured']),
      group('Brim',['Curved','Flat']),
      group('Closure',['Velcro','Buckle Strap','Snapback','Fitted']),
      group('Fabric',['Cotton Twill','Polyester','Performance Fabric']),
      group('Branding',['Embroidery','3D Embroidery','Patch']),
    ],
    specs:['Custom baseball cap','Sports teams, brands and staff merchandise'],
  },
  {
    name:'Visor Cap',
    sizes:['One Size'],
    zones:['Band Main Color','Visor Color','Trim / Accent Color'],
    groups:[
      group('Size',['One Size']),
      group('Visor Shape',['Curved','Semi Curved']),
      group('Closure',['Velcro','Buckle Strap']),
      group('Fabric',['Cotton Twill','Performance Polyester']),
      group('Sweatband',['Standard','Moisture Wicking']),
      group('Branding',['Embroidery','Heat Transfer','Patch']),
    ],
    specs:['Custom visor cap','Golf, tennis, outdoor sports and teamwear'],
  },
  {
    name:'Jeep Cap',
    sizes:['One Size','S/M','L/XL'],
    zones:['Main Knit Color','Cuff Color','Trim / Accent Color'],
    groups:[
      group('Size',['One Size','S/M','L/XL']),
      group('Knit Style',['Rib Knit','Plain Knit','Heavy Knit']),
      group('Cuff Style',['Folded Cuff','Short Cuff']),
      group('Material',['Acrylic','Cotton Blend','Wool Blend']),
      group('Branding',['Embroidery','Woven Patch','Leather Patch']),
    ],
    specs:['Custom jeep cap','Casual, warm and outdoor collections'],
  },
  {
    name:'Snapback Cap',
    sizes:['One Size'],
    zones:['Crown Main Color','Brim Color','Button / Eyelet Color','Trim / Accent Color'],
    groups:[
      group('Size',['One Size']),
      group('Profile',['Mid','High']),
      group('Structure',['Structured','Semi Structured']),
      group('Brim',['Flat','Curved']),
      group('Closure',['Plastic Snap','Premium Snap']),
      group('Fabric',['Cotton Twill','Polyester','Wool Blend']),
      group('Branding',['Embroidery','3D Embroidery','Patch']),
    ],
    specs:['Custom snapback cap','Streetwear, sports and merchandise collections'],
  },
]

export const ensureHeadwearCustomizers = async () => {
  const [cats] = await pool.execute("SELECT id FROM categories WHERE slug='headwear' LIMIT 1")
  if (!cats.length) return
  const categoryId = cats[0].id

  for (const config of validSeedRecords(products, 'headwear customizer')) {
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
      const specifications = [
        {label:'Product Detail',value:config.specs[0]},
        {label:'Branding Detail',value:'Custom colors, logo, embroidery and branded detailing'},
        {label:'Customization Detail',value:'Selectable size, material, construction and branding options'},
        {label:'Use',value:config.specs[1]},
        {label:'Design',value:`Design ${variant}`},
      ]

      await pool.execute(
        `INSERT IGNORE INTO product_customizer_items (
          product_id,name,slug,description,sizes_json,colors_json,color_zones_json,
          option_groups_json,specifications_json,default_options_json,basic_option_slugs_json,
          required_fields_json,default_color_mode,preset_colors_json,allow_custom_color,
          allow_logo_upload,allow_player_name,allow_player_number,allow_custom_notes,active,display_order
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,1,0,0,1,1,?)`,
        [
          productId, variantName, variantSlug, `Custom ${config.name.toLowerCase()} design ${variant} with editable colors, materials and branding.`,
          JSON.stringify(config.sizes), JSON.stringify(COLORS), JSON.stringify(config.zones),
          JSON.stringify(config.groups), JSON.stringify(specifications), JSON.stringify({}),
          JSON.stringify(['size']), JSON.stringify(['size','color']), 'custom', JSON.stringify({}), variant
        ]
      )

      await pool.execute(
        'UPDATE product_customizer_items SET active=1, display_order=? WHERE product_id=? AND slug=?',
        [variant, productId, variantSlug]
      )
    }
  }
}
