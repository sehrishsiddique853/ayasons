import pool from './mysql.js'

/**
 * Four complete soccer uniform designs. Each contains a matching jersey,
 * shorts and socks. Item images can be uploaded individually in Admin.
 * Existing customizer records are never deleted by this migration.
 */
const defaultItems = [
  {
    "name": "Soccer Uniform 1",
    "slug": "soccer-uniform-1",
    "description": "Complete soccer kit design 1, matching jersey, shorts and socks with personalized team colors and branding.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Black",
        "value": "#080808"
      },
      {
        "name": "White",
        "value": "#ffffff"
      },
      {
        "name": "Red",
        "value": "#e10600"
      },
      {
        "name": "Royal Blue",
        "value": "#0047ab"
      },
      {
        "name": "Green",
        "value": "#00a651"
      },
      {
        "name": "Gold",
        "value": "#f5d000"
      }
    ],
    "colorZones": [
      "Jersey Main Color",
      "Jersey Secondary Color",
      "Shorts Color",
      "Socks Color",
      "Trim / Accent Color"
    ],
    "optionGroups": [
      {
        "name": "Jersey Sleeve",
        "slug": "jersey-sleeve",
        "values": [
          "Short Sleeve",
          "Long Sleeve"
        ]
      },
      {
        "name": "Jersey Fit",
        "slug": "jersey-fit",
        "values": [
          "Regular",
          "Athletic",
          "Slim"
        ]
      },
      {
        "name": "Neck Style",
        "slug": "neck-style",
        "values": [
          "Crew Neck",
          "V Neck",
          "Polo Collar"
        ]
      },
      {
        "name": "Shorts Style",
        "slug": "shorts-style",
        "values": [
          "Regular",
          "Relaxed",
          "Compression"
        ]
      },
      {
        "name": "Shorts Size",
        "slug": "shorts-size",
        "values": [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "2XL",
          "3XL",
          "4XL"
        ]
      },
      {
        "name": "Sock Size",
        "slug": "sock-size",
        "values": [
          "Youth",
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Sock Length",
        "slug": "sock-length",
        "values": [
          "Crew",
          "Knee High",
          "Over Knee"
        ]
      },
      {
        "name": "Fabric",
        "slug": "fabric",
        "values": [
          "Dry Fit",
          "Polyester Interlock",
          "Bird Eye Mesh",
          "Micro Mesh"
        ]
      },
      {
        "name": "Fabric Pattern",
        "slug": "fabric-pattern",
        "values": [
          "Solid",
          "Stripes",
          "Geometric",
          "Gradient",
          "Custom Pattern"
        ]
      },
      {
        "name": "Material Finish",
        "slug": "material-finish",
        "values": [
          "Matte",
          "Gloss"
        ]
      },
      {
        "name": "Branding Method",
        "slug": "branding-method",
        "values": [
          "Sublimation",
          "Embroidery",
          "Heat Transfer",
          "Screen Print"
        ]
      },
      {
        "name": "Team Crest Position",
        "slug": "team-crest-position",
        "values": [
          "Left Chest",
          "Right Chest",
          "Center Chest"
        ]
      },
      {
        "name": "Sponsor Placement",
        "slug": "sponsor-placement",
        "values": [
          "Front",
          "Sleeve",
          "Back",
          "None"
        ]
      },
      {
        "name": "Number Style",
        "slug": "number-style",
        "values": [
          "Classic",
          "Block",
          "Modern"
        ]
      },
      {
        "name": "Trim Style",
        "slug": "trim-style",
        "values": [
          "Plain",
          "Contrast Piping",
          "Striped"
        ]
      },
      {
        "name": "Stitching",
        "slug": "stitching",
        "values": [
          "Standard",
          "Flatlock",
          "Reinforced"
        ]
      },
      {
        "name": "Packaging",
        "slug": "packaging",
        "values": [
          "Bulk Packed",
          "Individual Polybag",
          "Custom Branded Bag"
        ]
      }
    ],
    "allowLogoUpload": 1,
    "allowPlayerName": 1,
    "allowPlayerNumber": 1,
    "order": 1
  },
  {
    "name": "Soccer Uniform 2",
    "slug": "soccer-uniform-2",
    "description": "Complete soccer kit design 2, coordinated jersey, shorts and socks with custom panels, number and crest.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Black",
        "value": "#080808"
      },
      {
        "name": "White",
        "value": "#ffffff"
      },
      {
        "name": "Red",
        "value": "#e10600"
      },
      {
        "name": "Royal Blue",
        "value": "#0047ab"
      },
      {
        "name": "Green",
        "value": "#00a651"
      },
      {
        "name": "Gold",
        "value": "#f5d000"
      }
    ],
    "colorZones": [
      "Jersey Main Color",
      "Jersey Secondary Color",
      "Shorts Color",
      "Socks Color",
      "Trim / Accent Color"
    ],
    "optionGroups": [
      {
        "name": "Jersey Sleeve",
        "slug": "jersey-sleeve",
        "values": [
          "Short Sleeve",
          "Long Sleeve"
        ]
      },
      {
        "name": "Jersey Fit",
        "slug": "jersey-fit",
        "values": [
          "Regular",
          "Athletic",
          "Slim"
        ]
      },
      {
        "name": "Neck Style",
        "slug": "neck-style",
        "values": [
          "Crew Neck",
          "V Neck",
          "Polo Collar"
        ]
      },
      {
        "name": "Shorts Style",
        "slug": "shorts-style",
        "values": [
          "Regular",
          "Relaxed",
          "Compression"
        ]
      },
      {
        "name": "Shorts Size",
        "slug": "shorts-size",
        "values": [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "2XL",
          "3XL",
          "4XL"
        ]
      },
      {
        "name": "Sock Size",
        "slug": "sock-size",
        "values": [
          "Youth",
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Sock Length",
        "slug": "sock-length",
        "values": [
          "Crew",
          "Knee High",
          "Over Knee"
        ]
      },
      {
        "name": "Fabric",
        "slug": "fabric",
        "values": [
          "Dry Fit",
          "Polyester Interlock",
          "Bird Eye Mesh",
          "Micro Mesh"
        ]
      },
      {
        "name": "Fabric Pattern",
        "slug": "fabric-pattern",
        "values": [
          "Solid",
          "Stripes",
          "Geometric",
          "Gradient",
          "Custom Pattern"
        ]
      },
      {
        "name": "Material Finish",
        "slug": "material-finish",
        "values": [
          "Matte",
          "Gloss"
        ]
      },
      {
        "name": "Branding Method",
        "slug": "branding-method",
        "values": [
          "Sublimation",
          "Embroidery",
          "Heat Transfer",
          "Screen Print"
        ]
      },
      {
        "name": "Team Crest Position",
        "slug": "team-crest-position",
        "values": [
          "Left Chest",
          "Right Chest",
          "Center Chest"
        ]
      },
      {
        "name": "Sponsor Placement",
        "slug": "sponsor-placement",
        "values": [
          "Front",
          "Sleeve",
          "Back",
          "None"
        ]
      },
      {
        "name": "Number Style",
        "slug": "number-style",
        "values": [
          "Classic",
          "Block",
          "Modern"
        ]
      },
      {
        "name": "Trim Style",
        "slug": "trim-style",
        "values": [
          "Plain",
          "Contrast Piping",
          "Striped"
        ]
      },
      {
        "name": "Stitching",
        "slug": "stitching",
        "values": [
          "Standard",
          "Flatlock",
          "Reinforced"
        ]
      },
      {
        "name": "Packaging",
        "slug": "packaging",
        "values": [
          "Bulk Packed",
          "Individual Polybag",
          "Custom Branded Bag"
        ]
      }
    ],
    "allowLogoUpload": 1,
    "allowPlayerName": 1,
    "allowPlayerNumber": 1,
    "order": 2
  },
  {
    "name": "Soccer Uniform 3",
    "slug": "soccer-uniform-3",
    "description": "Complete soccer kit design 3, performance jersey, shorts and socks with personalized graphics and fit.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Black",
        "value": "#080808"
      },
      {
        "name": "White",
        "value": "#ffffff"
      },
      {
        "name": "Red",
        "value": "#e10600"
      },
      {
        "name": "Royal Blue",
        "value": "#0047ab"
      },
      {
        "name": "Green",
        "value": "#00a651"
      },
      {
        "name": "Gold",
        "value": "#f5d000"
      }
    ],
    "colorZones": [
      "Jersey Main Color",
      "Jersey Secondary Color",
      "Shorts Color",
      "Socks Color",
      "Trim / Accent Color"
    ],
    "optionGroups": [
      {
        "name": "Jersey Sleeve",
        "slug": "jersey-sleeve",
        "values": [
          "Short Sleeve",
          "Long Sleeve"
        ]
      },
      {
        "name": "Jersey Fit",
        "slug": "jersey-fit",
        "values": [
          "Regular",
          "Athletic",
          "Slim"
        ]
      },
      {
        "name": "Neck Style",
        "slug": "neck-style",
        "values": [
          "Crew Neck",
          "V Neck",
          "Polo Collar"
        ]
      },
      {
        "name": "Shorts Style",
        "slug": "shorts-style",
        "values": [
          "Regular",
          "Relaxed",
          "Compression"
        ]
      },
      {
        "name": "Shorts Size",
        "slug": "shorts-size",
        "values": [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "2XL",
          "3XL",
          "4XL"
        ]
      },
      {
        "name": "Sock Size",
        "slug": "sock-size",
        "values": [
          "Youth",
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Sock Length",
        "slug": "sock-length",
        "values": [
          "Crew",
          "Knee High",
          "Over Knee"
        ]
      },
      {
        "name": "Fabric",
        "slug": "fabric",
        "values": [
          "Dry Fit",
          "Polyester Interlock",
          "Bird Eye Mesh",
          "Micro Mesh"
        ]
      },
      {
        "name": "Fabric Pattern",
        "slug": "fabric-pattern",
        "values": [
          "Solid",
          "Stripes",
          "Geometric",
          "Gradient",
          "Custom Pattern"
        ]
      },
      {
        "name": "Material Finish",
        "slug": "material-finish",
        "values": [
          "Matte",
          "Gloss"
        ]
      },
      {
        "name": "Branding Method",
        "slug": "branding-method",
        "values": [
          "Sublimation",
          "Embroidery",
          "Heat Transfer",
          "Screen Print"
        ]
      },
      {
        "name": "Team Crest Position",
        "slug": "team-crest-position",
        "values": [
          "Left Chest",
          "Right Chest",
          "Center Chest"
        ]
      },
      {
        "name": "Sponsor Placement",
        "slug": "sponsor-placement",
        "values": [
          "Front",
          "Sleeve",
          "Back",
          "None"
        ]
      },
      {
        "name": "Number Style",
        "slug": "number-style",
        "values": [
          "Classic",
          "Block",
          "Modern"
        ]
      },
      {
        "name": "Trim Style",
        "slug": "trim-style",
        "values": [
          "Plain",
          "Contrast Piping",
          "Striped"
        ]
      },
      {
        "name": "Stitching",
        "slug": "stitching",
        "values": [
          "Standard",
          "Flatlock",
          "Reinforced"
        ]
      },
      {
        "name": "Packaging",
        "slug": "packaging",
        "values": [
          "Bulk Packed",
          "Individual Polybag",
          "Custom Branded Bag"
        ]
      }
    ],
    "allowLogoUpload": 1,
    "allowPlayerName": 1,
    "allowPlayerNumber": 1,
    "order": 3
  },
  {
    "name": "Soccer Uniform 4",
    "slug": "soccer-uniform-4",
    "description": "Complete soccer kit design 4, coordinated match kit with customizable jersey, shorts, socks and team detailing.",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "2XL",
      "3XL",
      "4XL"
    ],
    "colors": [
      {
        "name": "Black",
        "value": "#080808"
      },
      {
        "name": "White",
        "value": "#ffffff"
      },
      {
        "name": "Red",
        "value": "#e10600"
      },
      {
        "name": "Royal Blue",
        "value": "#0047ab"
      },
      {
        "name": "Green",
        "value": "#00a651"
      },
      {
        "name": "Gold",
        "value": "#f5d000"
      }
    ],
    "colorZones": [
      "Jersey Main Color",
      "Jersey Secondary Color",
      "Shorts Color",
      "Socks Color",
      "Trim / Accent Color"
    ],
    "optionGroups": [
      {
        "name": "Jersey Sleeve",
        "slug": "jersey-sleeve",
        "values": [
          "Short Sleeve",
          "Long Sleeve"
        ]
      },
      {
        "name": "Jersey Fit",
        "slug": "jersey-fit",
        "values": [
          "Regular",
          "Athletic",
          "Slim"
        ]
      },
      {
        "name": "Neck Style",
        "slug": "neck-style",
        "values": [
          "Crew Neck",
          "V Neck",
          "Polo Collar"
        ]
      },
      {
        "name": "Shorts Style",
        "slug": "shorts-style",
        "values": [
          "Regular",
          "Relaxed",
          "Compression"
        ]
      },
      {
        "name": "Shorts Size",
        "slug": "shorts-size",
        "values": [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "2XL",
          "3XL",
          "4XL"
        ]
      },
      {
        "name": "Sock Size",
        "slug": "sock-size",
        "values": [
          "Youth",
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Sock Length",
        "slug": "sock-length",
        "values": [
          "Crew",
          "Knee High",
          "Over Knee"
        ]
      },
      {
        "name": "Fabric",
        "slug": "fabric",
        "values": [
          "Dry Fit",
          "Polyester Interlock",
          "Bird Eye Mesh",
          "Micro Mesh"
        ]
      },
      {
        "name": "Fabric Pattern",
        "slug": "fabric-pattern",
        "values": [
          "Solid",
          "Stripes",
          "Geometric",
          "Gradient",
          "Custom Pattern"
        ]
      },
      {
        "name": "Material Finish",
        "slug": "material-finish",
        "values": [
          "Matte",
          "Gloss"
        ]
      },
      {
        "name": "Branding Method",
        "slug": "branding-method",
        "values": [
          "Sublimation",
          "Embroidery",
          "Heat Transfer",
          "Screen Print"
        ]
      },
      {
        "name": "Team Crest Position",
        "slug": "team-crest-position",
        "values": [
          "Left Chest",
          "Right Chest",
          "Center Chest"
        ]
      },
      {
        "name": "Sponsor Placement",
        "slug": "sponsor-placement",
        "values": [
          "Front",
          "Sleeve",
          "Back",
          "None"
        ]
      },
      {
        "name": "Number Style",
        "slug": "number-style",
        "values": [
          "Classic",
          "Block",
          "Modern"
        ]
      },
      {
        "name": "Trim Style",
        "slug": "trim-style",
        "values": [
          "Plain",
          "Contrast Piping",
          "Striped"
        ]
      },
      {
        "name": "Stitching",
        "slug": "stitching",
        "values": [
          "Standard",
          "Flatlock",
          "Reinforced"
        ]
      },
      {
        "name": "Packaging",
        "slug": "packaging",
        "values": [
          "Bulk Packed",
          "Individual Polybag",
          "Custom Branded Bag"
        ]
      }
    ],
    "allowLogoUpload": 1,
    "allowPlayerName": 1,
    "allowPlayerNumber": 1,
    "order": 4
  }
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
      color_zones_json JSON NULL,
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

  const [colorZoneColumns] = await pool.execute(
    "SHOW COLUMNS FROM product_customizer_items LIKE 'color_zones_json'"
  )

  if (!colorZoneColumns.length) {
    await pool.execute(
      'ALTER TABLE product_customizer_items ADD COLUMN color_zones_json JSON NULL AFTER colors_json'
    )
  }

  const [products] = await pool.execute(`
    SELECT p.id
    FROM products p
    INNER JOIN categories c ON c.id = p.category_id
    WHERE p.slug = 'soccer-uniform' AND c.slug = 'sportswear'
    LIMIT 1
  `)

  if (!products.length) return

  const productId = products[0].id

  // One-time transition from old component cards to complete kit designs.
  // Hide old cards but preserve their rows, images and admin changes.
  const [existingVariants] = await pool.execute(
    `SELECT COUNT(*) AS total
       FROM product_customizer_items
       WHERE product_id = ? AND slug IN (?, ?, ?, ?)`,
    [productId, ...defaultItems.map((item) => item.slug)]
  )

  if (Number(existingVariants[0].total) === 0) {
    await pool.execute(
      `UPDATE product_customizer_items
       SET active = 0
       WHERE product_id = ?
       AND slug IN ('jersey-shirt','soccer-shorts','soccer-socks',
                    'shin-guards','soccer-cleats-boots')`,
      [productId]
    )
  }

  // Idempotent seed: running the server again never overwrites admin edits.
  for (const item of defaultItems) {
    await pool.execute(`
      INSERT IGNORE INTO product_customizer_items (
        product_id, name, slug, description,
        sizes_json, colors_json, color_zones_json, option_groups_json,
        allow_custom_color, allow_logo_upload,
        allow_player_name, allow_player_number,
        allow_custom_notes, active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, 1, 1, ?)
    `, [
      productId, item.name, item.slug, item.description,
      JSON.stringify(item.sizes), JSON.stringify(item.colors),
      JSON.stringify(item.colorZones), JSON.stringify(item.optionGroups),
      item.allowLogoUpload, item.allowPlayerName,
      item.allowPlayerNumber, item.order,
    ])
  }
}
