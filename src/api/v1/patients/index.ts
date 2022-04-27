import { Router } from "express";

import validationMiddleware from "../../../middlewares/validationMiddleware";
import errorMiddleware from "../../../middlewares/errorMiddleware";
import * as GetPatients from "./get.patients";
import * as PostPatients from "./post.patients";
import * as GetPatientsPatientId from "./get.patients.patientId";
import * as PatchPatientsPatientId from "./patch.patients.patientId";
import * as DeletePatientsPatientId from "./delete.patients.patientId";
import * as GetSubstanceAmount from "./get.substanceAmount";
import passport from "passport";
import permissionMiddleware from "../../../middlewares/permissionMiddleware";
import { USER_ROLE } from "../../../utils/enums";

const router = Router()

export default () => {
  router.get('/',
    passport.authenticate('jwt-api'),
    permissionMiddleware([USER_ROLE.ADMIN]),
    validationMiddleware(GetPatients.schema),
    GetPatients.workflow)

  router.post('/',
    passport.authenticate('jwt-api'),
    permissionMiddleware([USER_ROLE.SUPER_ADMIN]),
    validationMiddleware(PostPatients.schema),
    PostPatients.workflow,
    errorMiddleware())

  router.get('/substanceAmount', GetSubstanceAmount.workflow, errorMiddleware())

  router.get('/:patientId',
    passport.authenticate('jwt-api'),
    permissionMiddleware([USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN]),
    validationMiddleware(GetPatientsPatientId.schema),
    GetPatientsPatientId.workflow, errorMiddleware())

  router.patch('/:patientId',
    passport.authenticate('jwt-api'),
    permissionMiddleware([USER_ROLE.SUPER_ADMIN]),
    validationMiddleware(PatchPatientsPatientId.schema),
    PatchPatientsPatientId.workflow,
    errorMiddleware())

  router.delete('/:patientId',
    passport.authenticate('jwt-api'),
    permissionMiddleware([USER_ROLE.SUPER_ADMIN]),
    validationMiddleware(DeletePatientsPatientId.schema),
    DeletePatientsPatientId.workflow,
    errorMiddleware())

  return router
}
