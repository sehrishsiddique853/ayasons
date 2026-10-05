import express from 'express'
import { submitCartQuote } from '../controllers/quoteController.js'

const router = express.Router()

router.post('/', submitCartQuote)

export default router
