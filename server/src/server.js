import 'dotenv/config'

import app from './app.js'

import pool, {
  testMySQLConnection,
} from './config/mysql.js'
import { ensureProductCustomizerSchema } from './config/productCustomizerSchema.js'
import { ensureGlovesCategory } from './config/glovesCatalog.js'
import { ensureSportsCustomizers } from './config/sportsCustomizers.js'
import { ensureStreetwearCustomizers } from './config/streetwearCustomizers.js'
import { ensureActivewearCustomizers } from './config/activewearCustomizers.js'
import { ensureWorkwearSafetyProducts } from './config/workwearSafetyCatalog.js'
import { ensureWorkwearCustomizers } from './config/workwearCustomizers.js'
import { ensureHeadwearCustomizers } from './config/headwearCustomizers.js'
import { ensureAccessoriesCustomizers } from './config/accessoriesCustomizers.js'
import { ensureGloveCustomizers } from './config/gloveCustomizers.js'
import { ensureVarsityJacketCustomizers } from './config/varsityJacketCustomizers.js'


const PORT =
  process.env.PORT || 5000

const runBootstrapTask = async (label, task) => {
  try {
    await task()
  } catch (error) {
    console.error(
      `[startup] ${label} was skipped; the API will continue running: ${error.message}`
    )
  }
}


const startServer = async () => {
  try {
    /*
    |--------------------------------------------------------------------------
    | MySQL Connection
    |--------------------------------------------------------------------------
    */

    await testMySQLConnection()
    const startupTasks = [
      ['product customizer schema', ensureProductCustomizerSchema],
      ['gloves catalog', ensureGlovesCategory],
      ['sports customizers', ensureSportsCustomizers],
      ['streetwear customizers', ensureStreetwearCustomizers],
      ['activewear customizers', ensureActivewearCustomizers],
      ['workwear safety catalog', ensureWorkwearSafetyProducts],
      ['workwear customizers', ensureWorkwearCustomizers],
      ['headwear customizers', ensureHeadwearCustomizers],
      ['accessories customizers', ensureAccessoriesCustomizers],
      ['glove customizers', ensureGloveCustomizers],
      ['varsity jacket customizers', ensureVarsityJacketCustomizers],
    ]

    for (const [label, task] of startupTasks) {
      await runBootstrapTask(label, task)
    }


    /*
    |--------------------------------------------------------------------------
    | Start HTTP Server
    |--------------------------------------------------------------------------
    */

    const server = app.listen(
      PORT,
      () => {
        console.log(
          `AYOSONS API running on port ${PORT}`
        )

        console.log(
          `Environment: ${
            process.env.NODE_ENV ||
            'development'
          }`
        )
      }
    )


    /*
    |--------------------------------------------------------------------------
    | Graceful Shutdown
    |--------------------------------------------------------------------------
    */

    const shutdown =
      (signal) => {
        console.log(
          `\n${signal} received. Shutting down...`
        )


        server.close(
          async () => {
            try {
              await pool.end()


              console.log(
                'MySQL connection pool closed.'
              )


              console.log(
                'HTTP server closed.'
              )


              process.exit(0)

            } catch (error) {

              console.error(
                'Shutdown error:',
                error.message
              )


              process.exit(1)
            }
          }
        )
      }


    process.on(
      'SIGTERM',
      () =>
        shutdown('SIGTERM')
    )


    process.on(
      'SIGINT',
      () =>
        shutdown('SIGINT')
    )


    /*
    |--------------------------------------------------------------------------
    | Unhandled Promise Rejections
    |--------------------------------------------------------------------------
    */

    process.on(
      'unhandledRejection',
      (error) => {
        console.error(
          'Unhandled Rejection:',
          error
        )


        server.close(
          async () => {
            try {
              await pool.end()
            } catch (
              closeError
            ) {
              console.error(
                'MySQL close error:',
                closeError.message
              )
            }


            process.exit(1)
          }
        )
      }
    )

  } catch (error) {

    console.error(
      'Server startup failed:',
      error.message
    )


    try {
      await pool.end()
    } catch {
      // Pool may not have opened successfully.
    }


    process.exit(1)
  }
}


startServer()
