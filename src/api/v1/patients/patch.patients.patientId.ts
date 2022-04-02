import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { GENDER } from "../../../utils/enums";
import { PatientModel } from "../../../db/models/patients";
import { DiagnoseModel } from "../../../db/models/diagnoses";
import { SubstanceModel } from "../../../db/models/substances";
import { IMessage, IPatientsMessageResponse } from "../../../utils/interfaces";

export const schema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().max(100),
    lastName: Joi.string().max(100),
    birthdate: Joi.date(),
    height: Joi.number().min(1),
    weight: Joi.number().max(200),
    identificationNumber: Joi.string().pattern(/^[a-zA-Z0-9]*$/).length(12),
    gender: Joi.string().valid(...Object.values(GENDER)),
    diagnoseID: Joi.number().integer().min(1)
  }),
  query: Joi.object(),
  params: Joi.object({
    patientId: Joi.number().integer().required()
  })
})

export const workflow = async (req: Request, res: Response, next: NextFunction) => {

  const patientId: number = Number(req.params.patientId)
  const patientNewData: PatientModel = req.body

  try {
    const patientModel = await PatientModel.findByPk(patientId, {
      include: {
        model: DiagnoseModel,
        include: [{ model: SubstanceModel }]
      }
    })
    if(!patientModel) {
      throw new Error('Patient not found.')
    }

    const diagnose = await DiagnoseModel.findAll({
      where: {
        id: patientNewData.diagnoseID
      }
    })
    if (diagnose.length === 0) {
      throw new Error('Diagnose not found.')
    }

    const patientUnique = await PatientModel.findAll({
      where: {
        identificationNumber: patientNewData.identificationNumber
      }
    })
    if (patientUnique.length > 0) {
      throw new Error('Patient\'s identification number already exists.')
    }

    await patientModel.update(patientNewData)
    await patientModel.save()


    const message: IMessage = { message: 'Patient updated.', type: 'SUCCESS' }
    const responseMessage: IPatientsMessageResponse = { messages: [message] }

    res.status(200).json(responseMessage)
  } catch (error) {
    return next(error)
  }

}
