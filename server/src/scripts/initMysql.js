import 'dotenv/config'

import mysql from 'mysql2/promise'

import fs from 'node:fs/promises'

import path from 'node:path'

import {
  fileURLToPath,
} from 'node:url'


const __filename =
  fileURLToPath(
    import.meta.url
  )

const __dirname =
  path.dirname(
    __filename
  )


const requiredVariables = [
  'MYSQL_HOST',
  'MYSQL_USER',
  'MYSQL_DATABASE',
]


const validateConfig = () => {
  const missing =
    requiredVariables.filter(
      (key) =>
        !process.env[key]
    )


  if (missing.length) {
    throw new Error(
      `Missing MySQL environment variables: ${missing.join(', ')}`
    )
  }


  const databaseName =
    process.env.MYSQL_DATABASE


  if (
    !/^[a-zA-Z0-9_]+$/.test(
      databaseName
    )
  ) {
    throw new Error(
      'MYSQL_DATABASE may only contain letters, numbers and underscores.'
    )
  }
}


const mysqlConfig = {
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
}


const initializeMySQL =
  async () => {
    let serverConnection

    let databaseConnection


    try {
      validateConfig()


      const databaseName =
        process.env.MYSQL_DATABASE


      console.log(
        'Connecting to MySQL...'
      )


      /*
      |--------------------------------------------------------------------------
      | Connect Without Database First
      |--------------------------------------------------------------------------
      */

      serverConnection =
        await mysql.createConnection({
          ...mysqlConfig,
        })


      /*
      |--------------------------------------------------------------------------
      | Create Database
      |--------------------------------------------------------------------------
      */

      await serverConnection.query(
        `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`
         CHARACTER SET utf8mb4
         COLLATE utf8mb4_unicode_ci`
      )


      console.log(
        `Database ready: ${databaseName}`
      )


      await serverConnection.end()

      serverConnection = null


      /*
      |--------------------------------------------------------------------------
      | Connect To AYOSONS Database
      |--------------------------------------------------------------------------
      */

      databaseConnection =
        await mysql.createConnection({
          ...mysqlConfig,

          database:
            databaseName,

          multipleStatements:
            true,
        })


      /*
      |--------------------------------------------------------------------------
      | Read SQL Schema
      |--------------------------------------------------------------------------
      */

      const schemaPath =
        path.resolve(
          __dirname,
          '../sql/schema.sql'
        )


      const schema =
        await fs.readFile(
          schemaPath,
          'utf8'
        )


      /*
      |--------------------------------------------------------------------------
      | Create Tables
      |--------------------------------------------------------------------------
      */

      await databaseConnection.query(
        schema
      )


      console.log(
        'MySQL tables created successfully.'
      )

      console.log(
        '✓ categories'
      )

      console.log(
        '✓ products'
      )


    } catch (error) {

      console.error(
        'MySQL initialization failed:'
      )

      console.error(
        error.message
      )

      process.exitCode = 1

    } finally {

      if (serverConnection) {
        await serverConnection.end()
      }


      if (databaseConnection) {
        await databaseConnection.end()
      }
    }
  }


initializeMySQL()