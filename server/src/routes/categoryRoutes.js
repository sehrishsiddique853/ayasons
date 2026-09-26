
import express from 'express'

import {
  getCategories,
  getCategoryBySlug,
} from '../controllers/categoryController.js'

import {
  getProductsByCategory,
} from '../controllers/productController.js'


const router = express.Router()


/*
|--------------------------------------------------------------------------
| Public Category Routes
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  getCategories
)


router.get(
  '/:slug/products',
  getProductsByCategory
)


router.get(
  '/:slug',
  getCategoryBySlug
)


export default router
