import 'dotenv/config'

import mysql from 'mysql2/promise'


const manufacturingStats =
  JSON.stringify([
    {
      value: '10+',
      label: 'Years Experience',
    },
    {
      value: '2015_',
      label: 'Since',
    },
    {
      value: '150+',
      label: 'Skilled Professionals',
    },
  ])


const departmentStats =
  JSON.stringify([
    {
      value: '150+',
      label: 'Skilled Professionals',
    },
    {
      value: '40K–50K+',
      label: 'Pieces Monthly Capacity',
    },
    {
      value: '06',
      label: 'Production Departments',
    },
    {
      value: '20+',
      label: 'Years Experience',
    },
  ])


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
        CREATE TABLE IF NOT EXISTS homepage_content (

          id TINYINT UNSIGNED NOT NULL,

          about_image_blob LONGBLOB NULL,

          about_image_mime
            VARCHAR(100) NULL,

          about_image_name
            VARCHAR(255) NULL,


          manufacturing_stats_json
            JSON NOT NULL,


          manufacturing_video_blob
            LONGBLOB NULL,

          manufacturing_video_mime
            VARCHAR(100) NULL,

          manufacturing_video_name
            VARCHAR(255) NULL,


          department_stats_json
            JSON NOT NULL,


          updated_at
            TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP,


          PRIMARY KEY (id)

        )
      `)


      await connection.execute(
        `
        INSERT INTO homepage_content (
          id,
          manufacturing_stats_json,
          department_stats_json
        )

        VALUES (
          1,
          ?,
          ?
        )

        ON DUPLICATE KEY UPDATE
          id = id
        `,
        [
          manufacturingStats,
          departmentStats,
        ]
      )


      console.log(
        'Homepage content table ready.'
      )

      console.log(
        '✓ About image storage'
      )

      console.log(
        '✓ Manufacturing statistics'
      )

      console.log(
        '✓ Manufacturing video storage'
      )

      console.log(
        '✓ Department statistics'
      )

    } catch (error) {

      console.error(
        'Homepage migration failed:'
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