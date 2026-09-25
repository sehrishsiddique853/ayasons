import express from 'express'
import {
  publicJsonCache,
} from '../middleware/publicCache.js'

import {
  getStandards,
  getStandardLogo,
  getStandardCertificate,
} from '../controllers/standardController.js'


const router =
  express.Router()


router.get(
  '/',
  publicJsonCache(),
  getStandards
)


router.get(
  '/:id/logo',
  getStandardLogo
)


router.get(
  '/:id/certificate',
  getStandardCertificate
)


export default router
