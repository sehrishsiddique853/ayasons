import express from 'express'
import { submitCartQuote } from '../controllers/quoteController.js'
import { uploadQuoteLogos } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.post('/', uploadQuoteLogos.array('logos', 20), submitCartQuote)

export default router
