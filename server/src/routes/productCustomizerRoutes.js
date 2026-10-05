import express from 'express'
import { getPublicProductCustomizer } from '../controllers/productCustomizerController.js'

const router = express.Router()
router.get('/:categorySlug/:productSlug', getPublicProductCustomizer)
export default router
