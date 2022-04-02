import { Router } from 'express'

import validationMiddleware from "../../../middlewares/validationMiddleware";
import errorMiddleware from "../../../middlewares/errorMiddleware";
import * as GetPatients from './get.patients'
import * as PostPatients from './post.patients'
import * as GetPatientsPatientId from './get.patients.patientId'
import * as PatchPatientsPatientId from './patch.patients.patientId'
import * as DeletePatientsPatientId from './delete.patients.patientId'

const router = Router()

export default () => {
  router.get('/', validationMiddleware(GetPatients.schema), GetPatients.workflow)
  router.post("/", validationMiddleware(PostPatients.schema), PostPatients.workflow, errorMiddleware())
  router.get('/:patientId', validationMiddleware(GetPatientsPatientId.schema), GetPatientsPatientId.workflow, errorMiddleware())
  router.patch('/:patientId', validationMiddleware(PatchPatientsPatientId.schema), PatchPatientsPatientId.workflow, errorMiddleware())
  router.delete('/:patientId', validationMiddleware(DeletePatientsPatientId.schema), DeletePatientsPatientId.workflow, errorMiddleware())

  return router
}
