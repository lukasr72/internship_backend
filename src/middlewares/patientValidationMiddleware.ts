import { Request, Response, NextFunction} from 'express'
export default function patientValidationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {

    const today: Date = new Date()
    const birthdate: Date = new Date(req.body.birthdate)

    if (birthdate >= today) {
      res.status(400).send({ error: "Invalid birthdate." })
    }

    const weight: number = req.body.weight
    if (weight <= 0) {
      res.status(400).send({ error: "Weight must be more then 0." })
    }

    const height: number = req.body.height
    if (height <= 0) {
      res.status(400).send({ error: "Height must be more then 0." })
    }

    return next()
  }
}