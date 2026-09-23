import 'dotenv/config'

import mongoose from 'mongoose'

import app from './app.js'
import connectDB from './config/db.js'

const PORT =
  process.env.PORT || 5000


const startServer = async () => {
  try {
    await connectDB()

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


    const shutdown = (signal) => {
      console.log(
        `\n${signal} received. Shutting down...`
      )

      server.close(async () => {
        try {
          await mongoose.connection.close()

          console.log(
            'MongoDB connection closed.'
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
      })
    }


    process.on(
      'SIGTERM',
      () => shutdown('SIGTERM')
    )

    process.on(
      'SIGINT',
      () => shutdown('SIGINT')
    )


    process.on(
      'unhandledRejection',
      (error) => {
        console.error(
          'Unhandled Rejection:',
          error
        )

        server.close(() => {
          process.exit(1)
        })
      }
    )

  } catch (error) {
    console.error(
      'Server startup failed:',
      error.message
    )

    process.exit(1)
  }
}

startServer()