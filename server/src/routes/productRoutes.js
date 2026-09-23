
import express from 'express'

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
  getProducts
)


router.get(
  '/category/:slug',
  getProductsByCategory
)


router.get(
  '/:id',
  getProductById
)


export default router