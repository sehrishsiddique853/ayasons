import express from 'express'

import {
  getPublicContactSettings,
  submitContactInquiry,
} from '../controllers/contactController.js'

const router = express.Router()

router.get('/settings', getPublicContactSettings)
router.post('/', submitContactInquiry)

export default router
