import express from 'express'
import { userSchema } from '../zodScehmas'
import { validiranjeSchema } from '../middlewares/zodValidacija'
import { logovanje, registracija } from '../controllers/userController'

const router = express.Router()

router.post('/register', validiranjeSchema(userSchema), registracija)

router.post('/login', validiranjeSchema(userSchema), logovanje)

export default router
