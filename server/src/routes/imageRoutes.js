import express from 'express'

import {
  getCategoryHeroImage,
  getCategoryCollectionImage,
  getProductImage,
} from '../controllers/imageController.js'


const router = express.Router()


router.get(
  '/categories/:id/hero',
  getCategoryHeroImage
)


router.get(
  '/categories/:id/collection',
  getCategoryCollectionImage
)


router.get(
  '/products/:id',
  getProductImage
)


export default router