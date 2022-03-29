import { Router } from 'express'

import validationMiddleware from '../../../middlewares/validationMiddleware'
import * as GetPatients from './get.patients'

const router = Router()

export default () => {
  router.get('/', validationMiddleware(), GetPatients.workflow)

  return router
}
