import express from 'express'

import {
  getStandards,
  getStandardLogo,
  getStandardCertificate,
} from '../controllers/standardController.js'


const router =
  express.Router()


router.get(
  '/',
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
