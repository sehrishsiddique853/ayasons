import express from 'express'
import rateLimit from 'express-rate-limit'

import {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
  updateAdminProfile,
changeAdminPassword,
} from '../controllers/adminAuthController.js'

import {
  requireAdmin,
} from '../middleware/adminAuthMiddleware.js'


const router =
  express.Router()


const loginLimiter =
  rateLimit({
    windowMs:
      15 *
      60 *
      1000,

    limit: 10,

    standardHeaders:
      'draft-8',

    legacyHeaders:
      false,

    message: {
      success: false,

      message:
        'Too many login attempts. Please try again later.',
    },
  })


router.post(
  '/login',
  loginLimiter,
  loginAdmin
)


router.get(
  '/me',
  requireAdmin,
  getCurrentAdmin
)


router.post(
  '/logout',
  logoutAdmin
)

router.put(
  '/profile',
  requireAdmin,
  updateAdminProfile
)


router.put(
  '/password',
  requireAdmin,
  changeAdminPassword
)


export default router