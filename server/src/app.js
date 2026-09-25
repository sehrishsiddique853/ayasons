import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import {
  notFound,
  errorHandler,
} from './middleware/errorMiddleware.js'
import homepageContentRoutes
  from './routes/homepageContentRoutes.js'

  import departmentRoutes
  from './routes/departmentRoutes.js'

import adminDepartmentRoutes
  from './routes/adminDepartmentRoutes.js'
import contactRoutes
  from './routes/contactRoutes.js'
  import standardRoutes
  from './routes/standardRoutes.js'

import adminStandardRoutes
  from './routes/adminStandardRoutes.js'


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
  process.env.CLIENT_URL ||
  'http://localhost:5173'
)
  .split(',')
  .map(
    (origin) =>
      origin.trim()
  )


app.use(
  cors({
    origin(
      origin,
      callback
    ) {
      /*
      | Allow Postman,
      | server-to-server requests,
      | etc.
      */

      if (!origin) {
        return callback(
          null,
          true
        )
      }


      if (
        allowedOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        )
      }


      return callback(
        new Error(
          'Not allowed by CORS'
        )
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
| Development Logging
|--------------------------------------------------------------------------
*/

if (
  process.env.NODE_ENV !==
  'production'
) {
  app.use(
    morgan('dev')
  )
}


/*
|--------------------------------------------------------------------------
| API Rate Limiting
|--------------------------------------------------------------------------
*/

const apiLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit:
      process.env.NODE_ENV ===
      'production'
        ? Number(
            process.env.API_RATE_LIMIT ||
            1000
          )
        : Number(
            process.env.API_RATE_LIMIT ||
            10000
          ),

    skip: (req) =>
      req.path.startsWith(
        '/images/'
      ),

    standardHeaders:
      'draft-8',

    legacyHeaders:
      false,

    message: {
      success: false,

      message:
        'Too many requests. Please try again later.',
    },
  })


app.use(
  '/api',
  apiLimiter
)


/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get(
  '/api/health',

  (
    req,
    res
  ) => {
    res
      .status(200)
      .json({
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

app.use(
  '/api/admin',
  adminRoutes
)

app.use(
  '/api/home-content',
  homepageContentRoutes
)

app.use(
  '/api/departments',
  departmentRoutes
)


app.use(
  '/api/admin/departments',
  adminDepartmentRoutes
)

app.use(
  '/api/contact',
  contactRoutes
)

app.use(
  '/api/standards',
  standardRoutes
)


app.use(
  '/api/admin/standards',
  adminStandardRoutes
)

/*
|--------------------------------------------------------------------------
| Error Handling
|--------------------------------------------------------------------------
*/

app.use(
  notFound
)


app.use(
  errorHandler
)


export default app
