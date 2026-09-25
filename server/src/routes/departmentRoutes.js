import express from 'express'
import {
  publicJsonCache,
} from '../middleware/publicCache.js'

import {
  getDepartments,
  getDepartmentImage,
} from '../controllers/departmentController.js'


const router =
  express.Router()


router.get(
  '/',
  publicJsonCache(),
  getDepartments
)


router.get(
  '/:id/image',
  getDepartmentImage
)


export default router
