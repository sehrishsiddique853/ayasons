
import express from 'express'
import {
  publicJsonCache,
} from '../middleware/publicCache.js'

import {
  getProducts,
  getProductById,
  getProductsByCategory,
} from '../controllers/productController.js'


const router = express.Router()


/*
|--------------------------------------------------------------------------
| Public Product Routes
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  publicJsonCache(),
  getProducts
)


router.get(
  '/category/:slug',
  publicJsonCache(),
  getProductsByCategory
)


router.get(
  '/:id',
  publicJsonCache(),
  getProductById
)


export default router
