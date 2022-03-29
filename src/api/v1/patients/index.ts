import { Router } from 'express'

import patientValidationMiddleware from "../../../middlewares/patientValidationMiddleware";
import patientIDValidationMiddleware from "../../../middlewares/patientIDValidationMiddleware"
import * as GetPatients from './get.patients'
import * as PostPatients from './post.patients'
import * as GetPatientsPatientId from './get.patients.patientId'
import * as PatchPatientsPatientId from './patch.patients.patientId'
import * as DeletePatientsPatientId from './delete.patients.patientId'

const router = Router()

export default () => {
  router.get('/', GetPatients.workflow)
  router.post('/', patientValidationMiddleware(), PostPatients.workflow)
  router.get('/:patientId', patientIDValidationMiddleware(), patientValidationMiddleware(), GetPatientsPatientId.workflow)
  router.patch('/:patientId', patientIDValidationMiddleware(), patientValidationMiddleware(), PatchPatientsPatientId.workflow)
  router.delete('/:patientId', patientIDValidationMiddleware(), DeletePatientsPatientId.workflow)

  return router
}
