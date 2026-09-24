import 'dotenv/config'

import app from './app.js'

import pool, {
  testMySQLConnection,
} from './config/mysql.js'


const PORT =
  process.env.PORT || 5000


const startServer = async () => {
  try {
    /*
    |--------------------------------------------------------------------------
    | MySQL Connection
    |--------------------------------------------------------------------------
    */

    await testMySQLConnection()


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