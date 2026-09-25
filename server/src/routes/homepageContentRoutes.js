import express from 'express'
import {
  publicJsonCache,
} from '../middleware/publicCache.js'

import {
  getHomepageContent,
  getHomepageAboutImage,
  getHomepageManufacturingVideo,
  getHomepageProcessImage,
} from '../controllers/homepageContentController.js'

const router =
  express.Router()


router.get(
  '/',
  publicJsonCache(),
  getHomepageContent
)


router.get(
  '/about-image',
  getHomepageAboutImage
)


router.get(
  '/manufacturing-video',
  getHomepageManufacturingVideo
)

router.get(
  '/process/:id/image',
  getHomepageProcessImage
)

export default router
