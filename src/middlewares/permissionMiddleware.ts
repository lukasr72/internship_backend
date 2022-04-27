import { NextFunction, Request, Response } from "express";
import { USER_ROLE } from "../utils/enums";

export default (permissions: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const user: any = req.user;

  try {
    if (!permissions.includes(user.role)) {
      throw new Error('Forbidden')
    }

    if (user.role === USER_ROLE.USER) {
      const patientID: number = Number(req.params.patientId)
      if (user.patientID !== patientID) {
        throw new Error('Forbidden')
      }
    }

    return next()
  } catch (error) {
    return next(error)
  }

}