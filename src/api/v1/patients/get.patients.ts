import { Request, Response } from 'express'
import { PatientModel } from "../../../db/models/patients";
import { DiagnoseModel } from "../../../db/models/diagnoses";
import { SubstanceModel } from "../../../db/models/substances";
import Joi from "joi";
import { GENDER } from "../../../utils/enums";

export const schema = Joi.object({
  body: Joi.object(),
  query: Joi.object({
    gender: Joi.string().valid(...Object.values(GENDER)),
    order: Joi.string(),
    limit: Joi.number(),
    page: Joi.number()
  }),
  params: Joi.object()
})

export const workflow = async (req: Request, res: Response) => {

  const gender = req.query.gender
  const qOrder = (req.query.order as string).split(':')
  const limit: number = Number(req.query.limit)
  const page: number = Number(req.query.page)
  const offset: number = page * limit

  const queryPatients = await PatientModel.findAll({
    include: {
      model: DiagnoseModel,
      include: [{model: SubstanceModel}]
    },
    where: {
      gender
    },
    order: [[qOrder[0], qOrder[1]]],
    limit,
    offset
  })

  res.json(queryPatients)
}
