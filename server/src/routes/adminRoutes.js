import express from 'express'

import {
  getAdminDashboard,
} from '../controllers/adminDashboardController.js'

import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  getAdminCategory,
  getAdminCategoryImage,
  updateAdminCategory,
} from '../controllers/adminCategoryController.js'

import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProduct,
  getAdminProductImage,
  getAdminProducts,
  updateAdminProduct,
} from '../controllers/adminProductController.js'

import {
  getAdminHotSelling,
  updateAdminHotSelling,
} from '../controllers/adminHotSellingController.js'

import {
  uploadCategoryImages,
  uploadProductImage,
} from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/dashboard', getAdminDashboard)

router.get('/categories', getAdminCategories)
router.get('/categories/:id', getAdminCategory)
router.get('/categories/:id/image', getAdminCategoryImage)
router.post(
  '/categories',
  uploadCategoryImages.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'collectionImage', maxCount: 1 },
  ]),
  createAdminCategory
)
router.put(
  '/categories/:id',
  uploadCategoryImages.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'collectionImage', maxCount: 1 },
  ]),
  updateAdminCategory
)
router.delete('/categories/:id', deleteAdminCategory)

router.get('/products', getAdminProducts)
router.get('/products/:id', getAdminProduct)
router.get('/products/:id/image', getAdminProductImage)
router.post(
  '/products',
  uploadProductImage.single('image'),
  createAdminProduct
)
router.put(
  '/products/:id',
  uploadProductImage.single('image'),
  updateAdminProduct
)
router.delete('/products/:id', deleteAdminProduct)
router.get(
  '/hot-selling',
  getAdminHotSelling
)


router.put(
  '/hot-selling',
  updateAdminHotSelling
)

export default router
