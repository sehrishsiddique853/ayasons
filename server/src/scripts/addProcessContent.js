import 'dotenv/config'

import mysql from 'mysql2/promise'


const processSteps = [
  {
    order: 1,
    number: '01',
    title: 'Design & Mockup',
    description:
      'Initial concept, colors, branding and visual direction are prepared before production starts.',
  },
  {
    order: 2,
    number: '02',
    title: 'Approval & Sampling',
    description:
      'Samples are reviewed for sizing, look, material feel and overall product approval.',
  },
  {
    order: 3,
    number: '03',
    title: 'Pattern & Cutting',
    description:
      'Approved products move into pattern development and precise cutting preparation.',
  },
  {
    order: 4,
    number: '04',
    title: 'Printing & Decoration',
    description:
      'Branding, logos and graphics are applied through the required decoration method.',
  },
  {
    order: 5,
    number: '05',
    title: 'Stitching & Assembly',
    description:
      'Panels and components are stitched together by skilled production teams.',
  },
  {
    order: 6,
    number: '06',
    title: 'Quality Control',
    description:
      'Finished products are checked for workmanship, measurements and consistency.',
  },
  {
    order: 7,
    number: '07',
    title: 'Packing & Dispatch',
    description:
      'Final products are packed and prepared for safe shipment to the customer.',
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
      | Add Process Header Fields
      |--------------------------------------------------------------------------
      */

      const headerColumns = [
        {
          name:
            'process_kicker',

          sql:
            `ALTER TABLE homepage_content
             ADD COLUMN process_kicker
             VARCHAR(100)
             NOT NULL
             DEFAULT 'Our Process'`,
        },

        {
          name:
            'process_heading_line_1',

          sql:
            `ALTER TABLE homepage_content
             ADD COLUMN process_heading_line_1
             VARCHAR(150)
             NOT NULL
             DEFAULT 'From Design'`,
        },

        {
          name:
            'process_heading_line_2',

          sql:
            `ALTER TABLE homepage_content
             ADD COLUMN process_heading_line_2
             VARCHAR(150)
             NOT NULL
             DEFAULT 'To Your Door.'`,
        },

        {
          name:
            'process_intro',

          sql:
            `ALTER TABLE homepage_content
             ADD COLUMN process_intro
             TEXT NULL`,
        },
      ]


      for (
        const column
        of headerColumns
      ) {

        const [existing] =
          await connection.execute(
            `
            SELECT
              COLUMN_NAME

            FROM INFORMATION_SCHEMA.COLUMNS

            WHERE
              TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'homepage_content'
              AND COLUMN_NAME = ?
            `,
            [
              column.name,
            ]
          )


        if (
          existing.length === 0
        ) {

          await connection.execute(
            column.sql
          )


          console.log(
            `✓ ${column.name}`
          )

        } else {

          console.log(
            `✓ ${column.name} already exists`
          )

        }

      }


      /*
      |--------------------------------------------------------------------------
      | Create Process Cards Table
      |--------------------------------------------------------------------------
      */

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS homepage_process_steps (

          id BIGINT UNSIGNED
            NOT NULL
            AUTO_INCREMENT,

          step_order
            TINYINT UNSIGNED
            NOT NULL,

          step_number
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
            uq_homepage_process_order (
              step_order
            )
        )
      `)


      /*
      |--------------------------------------------------------------------------
      | Default Intro
      |--------------------------------------------------------------------------
      */

      await connection.execute(
        `
        UPDATE homepage_content

        SET process_intro = ?

        WHERE
          id = 1
          AND (
            process_intro IS NULL
            OR process_intro = ''
          )
        `,
        [
          'A streamlined production journey — from concept development and sampling to manufacturing, inspection and final dispatch.',
        ]
      )


      /*
      |--------------------------------------------------------------------------
      | Seed 7 Existing Cards
      |--------------------------------------------------------------------------
      */

      for (
        const step
        of processSteps
      ) {

        await connection.execute(
          `
          INSERT INTO homepage_process_steps (
            step_order,
            step_number,
            title,
            description
          )

          VALUES (?, ?, ?, ?)

          ON DUPLICATE KEY UPDATE
            step_order =
              VALUES(step_order)
          `,
          [
            step.order,
            step.number,
            step.title,
            step.description,
          ]
        )

      }


      console.log(
        'Process section database ready.'
      )

      console.log(
        '✓ Process heading content'
      )

      console.log(
        '✓ 7 process cards'
      )

      console.log(
        '✓ Process card image storage'
      )

    } catch (error) {

      console.error(
        'Process content migration failed:'
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