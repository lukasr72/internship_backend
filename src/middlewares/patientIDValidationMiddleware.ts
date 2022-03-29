import { Request, Response, NextFunction} from 'express'
export default function patientValidationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {

    if(isNaN(Number(req.params.patientId))) {
      res.status(404).send({ error: "Invalid patient ID." })
    }

    return next()
  }
}