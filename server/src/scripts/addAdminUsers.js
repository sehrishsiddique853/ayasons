import 'dotenv/config'

import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'


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
      | Admin Users Table
      |--------------------------------------------------------------------------
      */

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS admin_users (

          id BIGINT UNSIGNED
            NOT NULL
            AUTO_INCREMENT,

          name VARCHAR(120)
            NOT NULL,

          email VARCHAR(255)
            NOT NULL,

          password_hash VARCHAR(255)
            NOT NULL,

          active BOOLEAN
            NOT NULL
            DEFAULT TRUE,

          last_login_at
            TIMESTAMP NULL,

          created_at
            TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP,

          updated_at
            TIMESTAMP NOT NULL
            DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP,

          PRIMARY KEY (id),

          UNIQUE KEY
            uq_admin_users_email (
              email
            )
        )
      `)


      /*
      |--------------------------------------------------------------------------
      | Initial Admin
      |--------------------------------------------------------------------------
      |
      | Credentials come from .env.
      | The plain password is NEVER stored.
      |
      */

      const email =
        process.env.ADMIN_EMAIL
          ?.trim()
          .toLowerCase()


      const password =
        process.env.ADMIN_PASSWORD


      const name =
        process.env.ADMIN_NAME
          ?.trim() ||
        'Administrator'


      if (
        !email ||
        !password
      ) {

        throw new Error(
          'ADMIN_EMAIL and ADMIN_PASSWORD must be set in the server .env file.'
        )

      }


      if (
        password.length < 8
      ) {

        throw new Error(
          'ADMIN_PASSWORD must contain at least 8 characters.'
        )

      }


      const [existingRows] =
        await connection.execute(
          `
            SELECT id

            FROM admin_users

            WHERE email = ?

            LIMIT 1
          `,
          [
            email,
          ]
        )


      if (
        existingRows.length === 0
      ) {

        const passwordHash =
          await bcrypt.hash(
            password,
            12
          )


        await connection.execute(
          `
            INSERT INTO admin_users (
              name,
              email,
              password_hash,
              active
            )

            VALUES (?, ?, ?, 1)
          `,
          [
            name,
            email,
            passwordHash,
          ]
        )


        console.log(
          `✓ Admin created: ${email}`
        )

      } else {

        console.log(
          `✓ Admin already exists: ${email}`
        )

      }


      console.log(
        'Admin authentication database ready.'
      )

    } catch (error) {

      console.error(
        'Admin authentication migration failed:'
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