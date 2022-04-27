import { Router } from "express";
import * as GetUsers from "../users/get.users";
import * as Seed from "../users/seed";
import errorMiddleware from "../../../middlewares/errorMiddleware";

const router = Router()

export default () => {

  router.get('/', GetUsers.workflow, errorMiddleware())

  router.get('/seed', Seed.workflow, errorMiddleware())

  return router
}