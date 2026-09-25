import 'dotenv/config'

import mysql from 'mysql2/promise'


const departments = [
  {
    order: 1,
    number: '01',
    title: 'Pattern & Cutting',
    description:
      'From pattern development and size grading to precise cutting, every garment begins with accuracy and careful preparation.',
  },

  {
    order: 2,
    number: '02',
    title: 'Sublimation Printing',
    description:
      'Performance apparel is produced with high-quality sublimation processes for vibrant colors, graphics and lasting finishes.',
  },

  {
    order: 3,
    number: '03',
    title: 'Embroidery & Decoration',
    description:
      'Custom logos, names and branding are applied using embroidery and decoration techniques according to product requirements.',
  },

  {
    order: 4,
    number: '04',
    title: 'Stitching Floor',
    description:
      'Experienced production teams handle garment assembly with attention to construction, strength and finishing standards.',
  },

  {
    order: 5,
    number: '05',
    title: 'Bag Manufacturing',
    description:
      'Custom kit bags, duffle bags and other accessories are developed with durable materials and reinforced construction.',
  },

  {
    order: 6,
    number: '06',
    title: 'Quality Control & Packing',
    description:
      'Finished products are inspected for workmanship, measurements and overall quality before final packing and dispatch.',
  },
]


const runMigration =
  async () => {

    let connection


    try {

      connection =
        await mysql.createConnection({
          host:
            process.env.MYSQL_HOST,

          port:
            Number(
              process.env.MYSQL_PORT ||
              3306
            ),

          user:
            process.env.MYSQL_USER,

          password:
            process.env.MYSQL_PASSWORD ||
            '',

          database:
            process.env.MYSQL_DATABASE,
        })


      await connection.execute(`
        CREATE TABLE IF NOT EXISTS homepage_departments (

          id BIGINT UNSIGNED
            NOT NULL
            AUTO_INCREMENT,

          department_order
            TINYINT UNSIGNED
            NOT NULL,

          department_number
            VARCHAR(10)
            NOT NULL,

          title
            VARCHAR(150)
            NOT NULL,

          description
            TEXT
            NOT NULL,

          image_blob
            LONGBLOB NULL,

          image_mime
            VARCHAR(100) NULL,

          image_name
            VARCHAR(255) NULL,

          created_at
            TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP,

          updated_at
            TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP,

          PRIMARY KEY (id),

          UNIQUE KEY
            uq_homepage_department_order (
              department_order
            )
        )
      `)


      for (
        const department
        of departments
      ) {

        await connection.execute(
          `
          INSERT INTO homepage_departments (
            department_order,
            department_number,
            title,
            description
          )

          VALUES (?, ?, ?, ?)

          ON DUPLICATE KEY UPDATE
            department_order =
              VALUES(
                department_order
              )
          `,
          [
            department.order,
            department.number,
            department.title,
            department.description,
          ]
        )

      }


      console.log(
        'Homepage department cards ready.'
      )

      console.log(
        '✓ 6 department cards'
      )

      console.log(
        '✓ Image BLOB storage'
      )

    } catch (error) {

      console.error(
        'Department migration failed:'
      )

      console.error(
        error.message
      )

      process.exitCode = 1

    } finally {

      if (connection) {
        await connection.end()
      }

    }

  }


runMigration()