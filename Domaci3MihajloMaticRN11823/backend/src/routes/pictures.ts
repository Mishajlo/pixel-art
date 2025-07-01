import express from 'express'
import { tokenMiddleware } from '../middlewares/tokenMiddleware'
import { validiranjeSchema } from '../middlewares/zodValidacija'
import { postSchema, patchScheme } from '../zodScehmas'



import {
  getPictures,
  getPicture,
  postPicture,
  deletePicture,
  updatePicture,
} from '../controllers/pictureController'

const router = express.Router()

router.get('/', getPictures) //dodati za jednu sliku

router.get('/:pictureId', getPicture)

router.post('/', tokenMiddleware, validiranjeSchema(postSchema), postPicture)

router.delete('/:pictureId', tokenMiddleware, deletePicture)

router.patch('/:pictureId', tokenMiddleware, validiranjeSchema(patchScheme) ,updatePicture)

export default router
