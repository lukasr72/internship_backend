import { NextFunction, Request, Response } from "express";
import Joi from "joi"
import { GENDER } from "../../../utils/enums"
import { IMessage, IPatient, IPatientsPostResponse } from "../../../utils/interfaces";
import { models } from "../../../db";

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

export const workflow = async (req: Request, res: Response, next: NextFunction) => {
  const { Patient, Diagnose } = models

  const newPatient = req.body

  try {
    const diagnose = await Diagnose.findAll({
      where: {
        id: newPatient.diagnoseID
      }
    })
    if (diagnose.length === 0) {
      throw new Error('Diagnose not found.')
    }

    const patient = await Patient.findAll({
      where: {
        identificationNumber: newPatient.identificationNumber
      }
    })
    if (patient.length > 0) {
      throw new Error('Patient already exists.')
    }

    const patientModel = await Patient.create(newPatient)

    const message: IMessage = { message: 'New patient added', type: 'SUCCESS' }
    const patientInfo: IPatient = { id: patientModel.id }
    const responseMessage: IPatientsPostResponse = { messages: [message], patient: patientInfo }

    return res.status(200).json(responseMessage)
  } catch (error) {
    return next(error)
  }

}
