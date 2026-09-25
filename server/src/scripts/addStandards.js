import 'dotenv/config'

import mysql from 'mysql2/promise'


const standards = [
  {
    order: 1,
    title: 'ISO 9001:2015',
    description:
      'Quality management system',
  },

  {
    order: 2,
    title: 'OEKO-TEX® Standard 100',
    description:
      'Fabrics tested for harmful substances',
  },

  {
    order: 3,
    title: 'BSCI Audited',
    description:
      'Social compliance audit',
  },

  {
    order: 4,
    title: 'GRS Options',
    description:
      'Recycled polyester on request',
  },

  {
    order: 5,
    title: 'SGS Testing',
    description:
      'Third-party lab testing on request',
  },

  {
    order: 6,
    title: 'Export Licensed',
    description:
      'Export-ready manufacturing support',
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


      /*
      |--------------------------------------------------------------------------
      | Section Text
      |--------------------------------------------------------------------------
      */

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS homepage_standards_content (

          id TINYINT UNSIGNED
            NOT NULL,

          kicker VARCHAR(150)
            NOT NULL
            DEFAULT 'Certifications & Compliance',

          heading VARCHAR(255)
            NOT NULL
            DEFAULT 'Documentation Available On Request',

          footer_text TEXT NULL,

          updated_at
            TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP,

          PRIMARY KEY (id)
        )
      `)


      await connection.execute(
        `
        INSERT INTO homepage_standards_content (
          id,
          kicker,
          heading,
          footer_text
        )

        VALUES (
          1,
          ?,
          ?,
          ?
        )

        ON DUPLICATE KEY UPDATE
          id = id
        `,
        [
          'Certifications & Compliance',

          'Documentation Available On Request',

          `Verify before you order - we encourage it. Ask for certificate copies with your enquiry, book a live video tour on WhatsApp, and order a sample before bulk. Details on the certifications, quality control and about the factory pages.`,
        ]
      )


      /*
      |--------------------------------------------------------------------------
      | Certification Cards
      |--------------------------------------------------------------------------
      */

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS homepage_standards (

          id BIGINT UNSIGNED
            NOT NULL
            AUTO_INCREMENT,

          display_order INT UNSIGNED
            NOT NULL
            DEFAULT 0,

          title VARCHAR(180)
            NOT NULL,

          description TEXT
            NOT NULL,


          logo_image_blob
            LONGBLOB NULL,

          logo_image_mime
            VARCHAR(100) NULL,

          logo_image_name
            VARCHAR(255) NULL,


          certificate_blob
            LONGBLOB NULL,

          certificate_mime
            VARCHAR(100) NULL,

          certificate_name
            VARCHAR(255) NULL,


          created_at
            TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP,

          updated_at
            TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP,


          PRIMARY KEY (id),

          KEY idx_homepage_standards_order (
            display_order,
            id
          )
        )
      `)


      /*
      |--------------------------------------------------------------------------
      | Seed Existing 6 Cards
      |--------------------------------------------------------------------------
      |
      | Only seed if table is empty.
      |
      */

      const [countRows] =
        await connection.execute(`
          SELECT COUNT(*) AS total
          FROM homepage_standards
        `)


      if (
        Number(
          countRows[0].total
        ) === 0
      ) {

        for (
          const standard
          of standards
        ) {

          await connection.execute(
            `
            INSERT INTO homepage_standards (
              display_order,
              title,
              description
            )

            VALUES (?, ?, ?)
            `,
            [
              standard.order,
              standard.title,
              standard.description,
            ]
          )

        }

      }


      console.log(
        'Certification section database ready.'
      )

      console.log(
        '✓ Section heading content'
      )

      console.log(
        '✓ Certification cards'
      )

      console.log(
        '✓ Logo image storage'
      )

      console.log(
        '✓ Certificate file storage'
      )

      console.log(
        '✓ Dynamic card count support'
      )

    } catch (error) {

      console.error(
        'Certification migration failed:'
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