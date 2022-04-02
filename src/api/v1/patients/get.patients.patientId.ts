import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { PatientModel } from "../../../db/models/patients";
import { DiagnoseModel } from "../../../db/models/diagnoses";
import { SubstanceModel } from "../../../db/models/substances";

export const schema = Joi.object({
  body: Joi.object(),
  query: Joi.object(),
  params: Joi.object({
    patientId: Joi.number().integer().required()
  })
})

export const workflow = async (req: Request, res: Response, next: NextFunction) => {

  const patientId: number = Number(req.params.patientId)

  try {
    const patient = await PatientModel.findByPk(patientId, {
      include: {
        model: DiagnoseModel,
        include: [{ model: SubstanceModel }]
      }
    })
    if(!patient) {
      throw new Error('Patient not found.')
    }

    res.status(200).json(patient)
  } catch (error) {
    return next(error)
  }

}
