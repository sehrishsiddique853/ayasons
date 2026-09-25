import express from 'express'

import {
  getDepartments,
  getDepartmentImage,
} from '../controllers/departmentController.js'


const router =
  express.Router()


router.get(
  '/',
  getDepartments
)


router.get(
  '/:id/image',
  getDepartmentImage
)


export default router