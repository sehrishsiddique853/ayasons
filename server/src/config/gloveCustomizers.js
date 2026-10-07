import pool from './mysql.js'

const COLORS = [
  { name:'Black', value:'#080808' },
  { name:'White', value:'#ffffff' },
  { name:'Navy', value:'#14213d' },
  { name:'Red', value:'#e10600' },
  { name:'Royal Blue', value:'#0047ab' },
  { name:'Grey', value:'#73777b' },
  { name:'Neon Yellow', value:'#d7ff00' },
  { name:'Orange', value:'#ff7a00' },
]

const slugify = (value='') => value.toString().toLowerCase().trim()
  .replace(/['’]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')

const group = (name, values) => ({ name, slug: slugify(name), values })

const products = [
  {
    name:'Safety Gloves',
    sizes:['XS','S','M','L','XL','2XL'],
    zones:['Backhand Main Color','Palm Color','Cuff Color','Trim / Accent Color'],
    groups:[
      group('Size',['XS','S','M','L','XL','2XL']),
      group('Glove Type',['General Work','Grip Glove','Impact Glove']),
      group('Palm Material',['PU Coated','Nitrile Coated','Latex Coated','Synthetic Leather']),
      group('Backhand',['Polyester Knit','Spandex','Impact TPR']),
      group('Cuff Style',['Knit Wrist','Elastic Wrist','Velcro Cuff']),
      group('Grip Level',['Standard','Enhanced','Heavy Duty']),
      group('Lining',['Unlined','Light Lining','Thermal Lining']),
      group('Branding',['Heat Transfer','Screen Print','Rubber Patch']),
    ],
    specs:[
      {label:'Product Detail',value:'Protective custom safety gloves'},
      {label:'Branding Detail',value:'Custom colors, company logo and branded cuff options'},
      {label:'Customization Detail',value:'Selectable palm coating, cuff, grip, lining and backhand material'},
      {label:'Use',value:'Worksites, industrial teams and safety equipment programs'},
    ],
    basic:['size','glove-type'],
  },
  {
    name:'Goalkeeper Gloves',
    sizes:['4','5','6','7','8','9','10','11','12'],
    zones:['Backhand Main Color','Palm Color','Cuff Color','Trim / Accent Color'],
    groups:[
      group('Size',['4','5','6','7','8','9','10','11','12']),
      group('Cut',['Negative Cut','Roll Finger','Flat Palm','Hybrid Cut']),
      group('Palm Latex',['3mm Training Latex','4mm Match Latex','4mm Contact Latex']),
      group('Backhand',['Latex','Neoprene','Breathable Mesh']),
      group('Closure',['Full Strap','Half Strap','Strapless']),
      group('Cuff',['Elastic Cuff','Neoprene Cuff','Extended Cuff']),
      group('Finger Protection',['None','Removable Spines','Fixed Spines']),
      group('Branding',['Heat Transfer','Silicone Print','Rubber Logo']),
    ],
    specs:[
      {label:'Product Detail',value:'Custom performance goalkeeper gloves'},
      {label:'Branding Detail',value:'Custom colors, club logo and branded backhand detailing'},
      {label:'Customization Detail',value:'Selectable glove cut, palm latex, closure, cuff and finger protection'},
      {label:'Use',value:'Goalkeepers, clubs, academies and match-day collections'},
    ],
    basic:['size','cut','palm-latex'],
  },
  {
    name:'Golf Gloves',
    sizes:['S','M','M/L','L','XL'],
    zones:['Main Color','Palm Color','Closure Color','Trim / Accent Color'],
    groups:[
      group('Size',['S','M','M/L','L','XL']),
      group('Hand',['Left Hand','Right Hand']),
      group('Material',['Cabretta Leather','Synthetic Leather','Hybrid']),
      group('Fit',['Regular','Cadet']),
      group('Palm',['Full Leather','Reinforced Palm','Perforated Palm']),
      group('Closure',['Velcro Tab','Low Profile Tab']),
      group('Ventilation',['Perforated Fingers','Mesh Inserts','Standard']),
      group('Branding',['Embroidery','Heat Transfer','Rubber Logo']),
    ],
    specs:[
      {label:'Product Detail',value:'Custom golf glove for reliable grip and comfort'},
      {label:'Branding Detail',value:'Custom colors, logo and branded closure options'},
      {label:'Customization Detail',value:'Selectable hand, material, fit, palm and ventilation'},
      {label:'Use',value:'Golf clubs, events, brands and private-label collections'},
    ],
    basic:['size','hand','material'],
  },
]

export const ensureGloveCustomizers = async () => {
  const [cats] = await pool.execute("SELECT id FROM categories WHERE slug='gloves' LIMIT 1")
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
          `Custom ${config.name.toLowerCase()} design ${variant} with editable colors, materials, fit and branding.`,
          JSON.stringify(config.sizes), JSON.stringify(COLORS), JSON.stringify(config.zones),
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
