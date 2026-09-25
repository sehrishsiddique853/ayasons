import express from 'express'

import {
  getAdminStandards,
  updateAdminStandardsContent,
  createAdminStandard,
  updateAdminStandard,
  updateAdminStandardLogo,
  updateAdminStandardCertificate,
  deleteAdminStandard,
} from '../controllers/adminStandardController.js'

import {
  uploadStandardLogo,
  uploadCertificate,
} from '../middleware/standardUploadMiddleware.js'


const router =
  express.Router()


router.get(
  '/',
  getAdminStandards
)


router.put(
  '/content',
  updateAdminStandardsContent
)


router.post(
  '/',
  createAdminStandard
)


router.put(
  '/:id',
  updateAdminStandard
)


router.put(
  '/:id/logo',

  uploadStandardLogo.single(
    'logo'
  ),

  updateAdminStandardLogo
)


router.put(
  '/:id/certificate',

  uploadCertificate.single(
    'certificate'
  ),

  updateAdminStandardCertificate
)


router.delete(
  '/:id',
  deleteAdminStandard
)


export default router