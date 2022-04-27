import { Router } from 'express'
import PatientsRouter from './patients'
import UsersRouter from './users'

const router = Router()

export default () => {
  router.use('/patients', PatientsRouter())
  router.use('/users', UsersRouter())

  return router
}
