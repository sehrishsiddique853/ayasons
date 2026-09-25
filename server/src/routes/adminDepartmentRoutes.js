import express from 'express'

import {
  getAdminDepartments,
  updateAdminDepartment,
  updateAdminDepartmentImage,
} from '../controllers/adminDepartmentController.js'

import {
  uploadImage,
} from '../middleware/uploadMiddleware.js'


const router =
  express.Router()


router.get(
  '/',
  getAdminDepartments
)


router.put(
  '/:id',
  updateAdminDepartment
)


router.put(
  '/:id/image',

  uploadImage.single(
    'image'
  ),

  updateAdminDepartmentImage
)


export default router