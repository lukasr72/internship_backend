import { NextFunction, Request, Response } from "express";
import Joi from "joi"
import { GENDER } from "../../../utils/enums";
import { IMessage, IPatient, IPatientsPostResponse } from "../../../utils/interfaces";
import { models } from "../../../db";
import { PatientModel } from "../../../db/models/patients";
import { DiagnoseModel } from "../../../db/models/diagnoses";

export const schema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    birthdate: Joi.date().required(),
    height: Joi.number().min(1).required(),
    weight: Joi.number().max(200).required(),
    identificationNumber: Joi.string().pattern(/^[a-zA-Z0-9]*$/).length(12).required(),
    gender: Joi.string().valid(...Object.values(GENDER)).required(),
    diagnoseID: Joi.number().integer().min(1).required()
  }),
  query: Joi.object(),
  params: Joi.object()
})

export const responseSchema = Joi.object({
  messages: Joi.array()
    .items(
      Joi.object({
        message: Joi.string().required(),
        type: Joi.string().max(50).required(),
      }).required()
    ).required(),
  patient: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
})

export const workflow = async (req: Request, res: Response, next: NextFunction) => {
  const { Patient, Diagnose } = models
  const newPatient: PatientModel = req.body

  try {
    const diagnose: DiagnoseModel = await Diagnose.findByPk(newPatient.diagnoseID)
    if (!diagnose) {
      throw new Error('Diagnose not found.')
    }

    const patient: PatientModel = await Patient.findOne({
      where: {
        identificationNumber: newPatient.identificationNumber
      }
    })
    if (patient) {
      throw new Error('Patient already exists.')
    }

    const patientModel: PatientModel = await Patient.create(newPatient)

    const message: IMessage = { message: 'New patient added', type: 'SUCCESS' }
    const patientInfo: IPatient = { id: patientModel.id }
    const responseMessage: IPatientsPostResponse = { messages: [message], patient: patientInfo }

    return res.status(200).json(responseMessage)
  } catch (error) {
    return next(error)
  }

}
