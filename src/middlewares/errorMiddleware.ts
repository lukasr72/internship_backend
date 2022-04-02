import { Request, Response, NextFunction} from 'express'

export default function errorMiddleware() {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {

    return res.status(404).json(err.message)
  }
}