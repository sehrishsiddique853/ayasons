
import express from 'express'
import {
  publicJsonCache,
} from '../middleware/publicCache.js'

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
  publicJsonCache(),
  getCategories
)


router.get(
  '/:slug/products',
  publicJsonCache(),
  getProductsByCategory
)


router.get(
  '/:slug',
  publicJsonCache(),
  getCategoryBySlug
)


export default router
