import express from 'express'

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
