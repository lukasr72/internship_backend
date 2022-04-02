import { Request, Response, NextFunction} from 'express'
import { Schema } from "joi"

export default function validationMiddleware(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {

    const { body, params, query } = req
    const validationResult = schema.validate( { query, body, params } )

    if (validationResult.error) {
      return res.status(400).json(validationResult.error)
    }

    req.body = validationResult.value.body
    req.params = validationResult.value.params
    req.query = validationResult.value.query

    return next()
  }
}