import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import imageRoutes from './routes/imageRoutes.js'

import path from 'node:path'

import {
  notFound,
  errorHandler,
} from './middleware/errorMiddleware.js'

const app = express()

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
)

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      // e.g. Postman / server-to-server requests
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(
        new Error('Not allowed by CORS')
      )
    },

    credentials: true,
  })
)

/*
|--------------------------------------------------------------------------
| Request Body Parsing
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: '1mb',
  })
)

app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb',
  })
)
/*
|--------------------------------------------------------------------------
| Static Uploaded Files
|--------------------------------------------------------------------------
*/

app.use(
  '/uploads',
  express.static(
    path.resolve(
      'uploads'
    )
  )
)
/*
|--------------------------------------------------------------------------
| Development Logging
|--------------------------------------------------------------------------
*/

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

/*
|--------------------------------------------------------------------------
| API Rate Limiting
|--------------------------------------------------------------------------
*/

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 300,

  standardHeaders: 'draft-8',

  legacyHeaders: false,

  message: {
    success: false,
    message:
      'Too many requests. Please try again later.',
  },
})

app.use('/api', apiLimiter)

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get(
  '/api/health',
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        'AYOSONS API is running',

      environment:
        process.env.NODE_ENV ||
        'development',
    })
  }
)


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
  '/api/categories',
  categoryRoutes
)

app.use(
  '/api/products',
  productRoutes
)
app.use(
  '/api/images',
  imageRoutes
)

/*
|--------------------------------------------------------------------------
| Error Handling
|--------------------------------------------------------------------------
*/

app.use(notFound)
app.use(errorHandler)

export default app