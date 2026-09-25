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
  uploadImage,
  uploadCategoryImages,
  uploadProductImage,
  uploadHomepageMedia,
} from '../middleware/uploadMiddleware.js'

import {
  getAdminHomepageContent,
  updateAdminHomepageContent,
  getAdminProcessContent,
  updateAdminProcessContent,
  updateAdminProcessImage,
} from '../controllers/adminHomepageContentController.js'

import {
  getAdminContactSettings,
  updateAdminContactSettings,
} from '../controllers/contactController.js'

const router = express.Router()

router.get('/dashboard', getAdminDashboard)
router.get('/contact', getAdminContactSettings)
router.put('/contact', updateAdminContactSettings)

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

router.get(
  '/home-content',
  getAdminHomepageContent
)


router.put(
  '/home-content',

  uploadHomepageMedia.fields([
    {
      name:
        'aboutImage',

      maxCount: 1,
    },

    {
      name:
        'manufacturingVideo',

      maxCount: 1,
    },
  ]),

  updateAdminHomepageContent
)

router.get(
  '/home-content/process',
  getAdminProcessContent
)


router.put(
  '/home-content/process',
  updateAdminProcessContent
)


router.put(
  '/home-content/process/:id/image',

  uploadImage.single(
    'image'
  ),

  updateAdminProcessImage
)

export default router
